use proc_macro::TokenStream;
use std::io::Read;

enum Part {
    Static(String),  // static string
    Dynamic(String), // field name
}

fn split(s: &str, placeholder: &str, field_name: &str) -> Vec<Part> {
    let mut parts = Vec::new();
    for (i, part) in s.split(placeholder).enumerate() {
        if i > 0 {
            parts.push(Part::Dynamic(field_name.to_string()));
        }
        parts.push(Part::Static(part.to_string()));
    }
    parts
}

fn split_parts(parts: Vec<Part>, placeholder: &str, field_name: &str) -> Vec<Part> {
    let mut new_parts = Vec::new();
    for part in parts {
        match part {
            Part::Static(s) => {
                new_parts.extend(split(&s, placeholder, field_name));
            }
            Part::Dynamic(_) => {
                new_parts.push(part);
            }
        }
    }
    new_parts
}

fn gen_code(contents: String, item_name: String) -> String {
    let parts = split(&contents, "%DOMAIN%", &format!("&{}.domain", item_name));
    let parts = split_parts(parts, "%HREF%", &format!("&{}.href", item_name));
    let parts = split_parts(
        parts,
        "%NOTE%",
        &format!("&{}.note.unwrap_or(\"无\".to_string())", item_name),
    );
    let parts = split_parts(parts, "%ID%", &format!("&{}.id.to_string()", item_name));

    // Generate code
    let mut code = String::new();

    code.push_str("r#\"");

    let mut i = 0;
    for part in parts {
        match part {
            Part::Static(s) => {
                code.push_str(&s);
            }
            Part::Dynamic(field_name) => {
                if i == 1 {
                    code.push_str("\"#.to_string() + ");
                } else {
                    code.push_str("\"# + ");
                }
                code.push_str(&field_name);
                code.push_str(" + r#\"");
            }
        }
        i += 1;
    }
    code.push_str("\"#");

    code
}

/// Usage:
/// let rendered_string = site_info!(item);
/// Will expand to:
/// let rendered_string = r#"...."# + format!("{}", &item.name) + ...;
#[proc_macro]
pub fn site_info(item: TokenStream) -> TokenStream {
    // Get item name
    let item_name = item.to_string();
    // Read ../out/id/[id].html
    let mut file = std::fs::File::open("../out/id/[id].html").unwrap();
    let mut contents = String::new();

    file.read_to_string(&mut contents).unwrap();

    let code = gen_code(contents, item_name);
    // Return code
    code.parse().unwrap()
}

#[proc_macro]
pub fn site_info_js(item: TokenStream) -> TokenStream {
    // Get item name
    let item_name = item.to_string();
    // Find .js file in ../out/_next/static/chunks/pages/id/
    // List all files in ../out/_next/static/chunks/pages/id/
    let files = std::fs::read_dir("../out/_next/static/chunks/pages/id/").unwrap();
    let mut js_file = String::new();
    for file in files {
        let file = file.unwrap();
        let file_name = file.file_name().into_string().unwrap();
        if file_name.ends_with(".js") {
            js_file = file_name;
            break;
        }
    }
    // Read ../out/_next/static/chunks/pages/id/[id].js
    let mut file =
        std::fs::File::open(format!("../out/_next/static/chunks/pages/id/{}", js_file)).unwrap();
    let mut contents = String::new();

    file.read_to_string(&mut contents).unwrap();

    // Gencode
    let code = gen_code(contents, item_name);
    // Return code
    code.parse().unwrap()
}

#[proc_macro]
pub fn make_static_router(_item: TokenStream) -> TokenStream {
    TokenStream::new()
}
