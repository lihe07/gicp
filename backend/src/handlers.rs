use salvo::prelude::*;
use serde::{Deserialize, Serialize};
use serde_json::json;
use sqlx::FromRow;
use crate::fs::get_file;

static INDEX: &'static str = include_str!("../../out/index.html");
static NOT_FOUND: &'static str = include_str!("../../out/404.html");

#[handler]
async fn index(res: &mut Response) {
    res.render(Text::Html(INDEX));
}

fn render_static(res: &mut Response, file: &'static [u8], path: &str) {
    res.write_body(file).expect("TODO: panic message");
    let mime = mime_guess::from_path(&path).first_or_octet_stream();
    let headers = res.headers_mut();
    headers.insert("Content-Type", mime.to_string().parse().unwrap());
}

#[handler]
async fn get_static(req: &mut Request, res: &mut Response) {
    let path = req.param::<String>("**path").unwrap();

    if let Some(file) = get_file(&path) {
        render_static(res, file, &path);
    } else {
        let path = path + ".html";
        if let Some(file) = get_file(&path) {
            render_static(res, file, &path);
        } else {
            res.set_status_code(StatusCode::NOT_FOUND);
            res.render(Text::Html(NOT_FOUND));
        }
    }
}


#[handler]
async fn login(req: &mut Request, res: &mut Response) {
    if check_auth(req.header("Authorization").unwrap_or("")) {
        res.render(Text::Html("OK"))
    } else {
        res.set_status_code(StatusCode::UNAUTHORIZED);
        res.render(Text::Html("Wrong username or password"));
    }
}

fn check_auth(header: &str) -> bool {
    let config = crate::CONFIG.get().unwrap();
    header == format!("Basic {}", base64::encode(format!("{}:{}", config.account.username, config.account.password)))
}

#[derive(Debug, Deserialize, Serialize, Extractible, FromRow)]
#[extract(default_source(from = "body", format = "json"))]
struct Item {
    id: i32,
    name: String,
    email: String,
    phone: Option<String>,
    domain: String,
    href: String,
    note: Option<String>,
    approved: bool,
}


#[handler]
async fn list(req: &mut Request, res: &mut Response) {
    let page = req.param::<i32>("page").unwrap_or(1);
    let page_size = req.param::<i32>("page_size").unwrap_or(10).min(100).max(1);
    let offset = (page - 1) * page_size;
    let conn = crate::DB.get().unwrap();

    let auth = check_auth(req.header("Authorization").unwrap_or(""));

    let where_clause = if auth {
        ""
    } else {
        "WHERE approved = 1"
    };

    // // Query the database
    // let mut items = sqlx::query_as::<_, Item>("SELECT * FROM items WHERE approved = 1 LIMIT ? OFFSET ?")
    //     .bind(page_size)
    //     .bind(offset)
    //     .fetch_all(conn)
    //     .await
    //     .unwrap();

    let mut items = sqlx::query_as::<_, Item>(&format!("SELECT * FROM items {} LIMIT ? OFFSET ?", where_clause))
        .bind(page_size)
        .bind(offset)
        .fetch_all(conn)
        .await
        .unwrap();

    // Get total pages
    // let total = sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM items WHERE approved = 1")
    //     .fetch_one(conn)
    //     .await
    //     .unwrap();
    let total = sqlx::query_scalar::<_, i64>(&format!("SELECT COUNT(*) FROM items {}", where_clause))
        .fetch_one(conn)
        .await
        .unwrap();

    if !auth {
        // Clear the phone number
        for item in items.iter_mut() {
            item.phone = None;
            item.email = "******".to_string();
        }
    }

    res.set_status_code(StatusCode::OK);

    res.render(Json(json!(
        {
            "items": items,
            "total": total,
            "total_pages": (total as f64 / page_size as f64).ceil() as i64,
        }
    )));
}

#[handler]
async fn create(req: &mut Request, res: &mut Response) {
    let item = req.extract::<Item>().await;
    dbg!(&item);
    if item.is_err() {
        res.set_status_code(StatusCode::BAD_REQUEST);
        res.render(Text::Html("Bad request"));
        return;
    }
    let item = item.unwrap();


    let conn = crate::DB.get().unwrap();
    // Insert into database
    sqlx::query("INSERT INTO items (name, email, phone, domain, href, note) VALUES (?, ?, ?, ?, ?, ?)")
        .bind(&item.name)
        .bind(&item.email)
        .bind(&item.phone)
        .bind(&item.domain)
        .bind(&item.href)
        .bind(&item.note)
        .execute(conn)
        .await
        .unwrap();
    res.render(Text::Plain("OK"));
}

#[handler]
async fn approve(req: &mut Request, res: &mut Response) {
    if !check_auth(req.header("Authorization").unwrap_or("")) {
        res.set_status_code(StatusCode::UNAUTHORIZED);
        res.render(Text::Html("Wrong username or password"));
        return;
    }

    let id = req.param::<i32>("id").unwrap();
    let conn = crate::DB.get().unwrap();
    sqlx::query("UPDATE items SET approved = 1 WHERE id = ?")
        .bind(id)
        .execute(conn)
        .await
        .unwrap();
    res.render(Text::Html("OK"));
}

#[handler]
async fn disapprove(req: &mut Request, res: &mut Response) {
    if !check_auth(req.header("Authorization").unwrap_or("")) {
        res.set_status_code(StatusCode::UNAUTHORIZED);
        res.render(Text::Html("Wrong username or password"));
        return;
    }

    let id = req.param::<i32>("id").unwrap();
    let conn = crate::DB.get().unwrap();
    sqlx::query("UPDATE items SET approved = 0 WHERE id = ?")
        .bind(id)
        .execute(conn)
        .await
        .unwrap();
    res.render(Text::Html("OK"));
}

#[handler]
async fn get(req: &mut Request, res: &mut Response) {
    let id = req.param::<i32>("id").unwrap();
    let conn = crate::DB.get().unwrap();
    let mut item = sqlx::query_as::<_, Item>("SELECT * FROM items WHERE id = ?")
        .bind(id)
        .fetch_one(conn)
        .await
        .unwrap();

    if !check_auth(req.header("Authorization").unwrap_or("")) {
        item.phone = None;
        item.email = "******".to_string();
    }
    res.render(Json(item));
}

#[handler]
async fn update(req: &mut Request, res: &mut Response) {
    // Check auth
    if !check_auth(req.header("Authorization").unwrap_or("")) {
        res.set_status_code(StatusCode::UNAUTHORIZED);
        res.render(Text::Html("Wrong username or password"));
        return;
    }

    let id = req.param::<i32>("id").unwrap();
    let item = req.extract::<Item>().await;

    if item.is_err() {
        res.set_status_code(StatusCode::BAD_REQUEST);
        res.render(Text::Html("Bad request"));
        return;
    }
    let item = item.unwrap();

    let conn = crate::DB.get().unwrap();
    sqlx::query("UPDATE items SET name = ?, email = ?, phone = ?, domain = ?, href = ?, note = ? WHERE id = ?")
        .bind(&item.name)
        .bind(&item.email)
        .bind(&item.phone)
        .bind(&item.domain)
        .bind(&item.href)
        .bind(&item.note)
        .bind(id)
        .execute(conn)
        .await
        .unwrap();
    res.render(Text::Html("OK"));
}

#[handler]
async fn delete(req: &mut Request, res: &mut Response) {
    // Check auth
    if !check_auth(req.header("Authorization").unwrap_or("")) {
        res.set_status_code(StatusCode::UNAUTHORIZED);
        res.render(Text::Html("Wrong username or password"));
        return;
    }
    let id = req.param::<i32>("id").unwrap();
    let conn = crate::DB.get().unwrap();
    sqlx::query("DELETE FROM items WHERE id = ?")
        .bind(id)
        .execute(conn)
        .await
        .unwrap();
    res.render(Text::Html("OK"));
}

pub fn make_router() -> Router {
    Router::new()
        .get(index)
        .push(
            Router::with_path("/api/login")
                .post(login)
        )
        .push(
            Router::with_path("/api/list")
                .get(list)
                .post(create)
        )
        .push(
            Router::with_path("/api/approve/<id>")
                .post(approve)
        )
        .push(
            Router::with_path("/api/disapprove/<id>")
                .post(disapprove)
        )
        .push(
            Router::with_path("/api/list/<id>")
                .get(get)
                .delete(delete)
                .put(update)
        )
        .push(
            Router::with_path("/<**path>")
                .get(get_static)
        )
}