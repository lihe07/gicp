use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::{Read, Write};
use log::info;

#[derive(Deserialize, Serialize)]
pub struct Account {
    pub(crate) username: String,
    pub(crate) password: String,
}

impl Default for Account {
    fn default() -> Self {
        info!("Default account:password is admin:admin114514");
        info!("Please change it in config.toml");

        Self {
            username: "admin".to_string(),
            password: "admin114514".to_string(),
        }
    }
}

#[derive(Deserialize, Serialize)]
pub struct Database {
    pub link: String,
}

impl Default for Database {
    fn default() -> Self {
        // If doesn't exist, create a new file
        let mut file = File::create("data.db").unwrap();
        file.write_all(b"").unwrap();
        Database {
            link: "sqlite://data.db".to_string()
        }
    }
}

#[derive(Deserialize, Serialize)]
pub struct Server {
    pub bind: String,
    pub log_level: String,
}

impl Default for Server {
    fn default() -> Self {
        Server {
            bind: "0.0.0.0:8080".to_string(),
            log_level: "info".to_string(),
        }
    }
}

#[derive(Default, Deserialize, Serialize)]
pub struct Config {
    pub account: Account,
    pub database: Database,
    pub server: Server,
}

impl Config {
    pub fn load() -> Self {
        // Load or create config.toml
        if let Ok(mut file) = File::open("config.toml") {
            // Load config.toml
            info!("Loading config.toml...");
            let mut str = String::new();
            file.read_to_string(&mut str).unwrap();
            let config: Config = toml::from_str(&str).unwrap();
            config
        } else {
            // Create config.toml
            info!("config.toml not found, creating a new one");
            let config = Config::default();
            let toml = toml::to_string(&config).unwrap();
            std::fs::write("config.toml", toml).unwrap();
            config
        }
    }
}

