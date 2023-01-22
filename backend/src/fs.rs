use include_dir::{Dir, include_dir};

static OUT: Dir = include_dir!("../out");

pub fn get_file(url: &str) -> Option<&'static str> {
    let path = url.trim_start_matches('/');
    OUT.get_file(path).map(|f| f.contents_utf8().unwrap())
}