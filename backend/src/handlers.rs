use salvo::prelude::*;
use crate::fs::get_file;

static INDEX: &'static str = include_str!("../../out/index.html");
static NOT_FOUND: &'static str = include_str!("../../out/404.html");

#[handler]
async fn index(res: &mut Response) {
    res.render(Text::Html(INDEX));
}


#[handler]
async fn get_static(req: &mut Request, res: &mut Response) {
    let path = req.param::<String>("**path").unwrap();

    if let Some(file) = get_file(&path) {
        res.render(Text::Html(file));
        let mime = mime_guess::from_path(&path).first_or_octet_stream();
        let headers = res.headers_mut();
        headers.insert("Content-Type", mime.to_string().parse().unwrap());
    } else {
        res.render(Text::Html(NOT_FOUND));
    }
}

pub fn make_router() -> Router {
    Router::new()
        .get(index)
        .push(
            Router::with_path("/<**path>")
                .get(get_static)
        )
}