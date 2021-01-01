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

pub fn esc_html(s: &str) -> String {
    let mut escaped = String::with_capacity(s.len());

    for c in s.chars() {
        match c {
            '<' => escaped.push_str("&lt;"),
            '>' => escaped.push_str("&gt;"),
            '&' => escaped.push_str("&amp;"),
            '\'' => escaped.push_str("&apos;"),
            '"' => escaped.push_str("&quot;"),
            _ => escaped.push(c),
        }
    }

    escaped
}

pub fn capitalize(s: &str) -> String {
    let mut capitalized = String::with_capacity(s.len());
    let mut first = true;
    for c in s.chars() {
        if first {
            c.to_uppercase()
                .for_each(|upper_c| capitalized.push(upper_c));
            first = false;
        } else {
            capitalized.push(c);
        }
    }

    capitalized
}
