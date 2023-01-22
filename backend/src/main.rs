use salvo::prelude::*;
mod handlers;
mod fs;

#[tokio::main]
async fn main() {
    let router = handlers::make_router();
    Server::new(TcpListener::bind("127.0.0.1:7878")).serve(router).await;
}
