use log::{error, info};
use salvo::prelude::*;

mod config;
mod fs;
mod handlers;

use once_cell::sync::OnceCell;
use salvo::cors::Cors;

type DbPool = sqlx::SqlitePool; // Currently use sqlite

static CONFIG: OnceCell<config::Config> = OnceCell::new();
static DB: OnceCell<DbPool> = OnceCell::new();

async fn ensure_table() {
    info!("Creating table if not exists...");
    sqlx::query(
        "CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        domain TEXT NOT NULL,
        href TEXT NOT NULL,
        note TEXT,
        approved INTEGER NOT NULL DEFAULT 0
    )",
    )
    .execute(DB.get().unwrap())
    .await
    .unwrap();
}

#[tokio::main]
async fn main() {
    let config = config::Config::load();
    let bind = config.server.bind.clone();
    let log_level = config.server.log_level.clone();

    // Set RUST_LOG to log_level
    std::env::set_var("RUST_LOG", log_level);
    pretty_env_logger::init();

    // Connect to database
    info!("Connecting to database...");
    match sqlx::SqlitePool::connect(&config.database.link).await {
        Ok(db) => {
            info!("Connected to database");
            DB.set(db).unwrap();
        }
        Err(e) => {
            error!("Failed to connect to database: {}", e);
            std::process::exit(1);
        }
    }

    ensure_table().await;

    let _ = CONFIG.set(config);

    let cors = Cors::builder()
        .allow_any_origin()
        .allow_methods(vec!["GET", "OPTIONS", "POST", "PUT", "DELETE"])
        .build();

    let router = handlers::make_router().hoop(cors);
    info!("Starting server on http://{}...", &bind);
    Server::new(TcpListener::bind(&bind)).serve(router).await;
}
