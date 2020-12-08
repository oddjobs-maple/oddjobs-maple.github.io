pub fn slugify(s: &str) -> String {
    let mut slug = String::with_capacity(s.len());

    for c in s.chars() {
        if c.is_whitespace() || c == '-' || c == '/' {
            slug.push('-');
        } else if c.is_ascii_alphanumeric() {
            slug.push(c.to_ascii_lowercase());
        }
    }

    slug
}
