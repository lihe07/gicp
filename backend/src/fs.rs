use include_dir::{Dir, include_dir};

static OUT: Dir = include_dir!("../out");


pub fn get_file(path: &str) -> Option<&'static [u8]> {
    OUT.get_file(path).map(|file| file.contents())
}

