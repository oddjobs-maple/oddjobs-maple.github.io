use crate::util::slugify;
use pulldown_cmark::{Alignment, Event, Options, Parser, Tag};
use std::{
    collections::HashSet, fs::File, io::prelude::*, path::Path, process,
};

static INDEX_PREAMBLE: &[u8] = br##"<!DOCTYPE html>
<html dir="ltr" lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Oddjobs | Guides</title>
    <meta name="description" content="The guild for MapleStory odd-jobbers" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />

    <link rel="stylesheet" type="text/css" href="../css/style.css" />
    <link rel="icon" type="image/png" href="../img/favicon.png" />
  </head>

  <body>
    <div id="nav-content-wrapper">
      <nav id="main-nav">
        <div id="main-nav-inner">
          <div id="main-nav-pullout"><span>&#x25b6;</span></div>

          <a href="../" class="nav-h"
            >Oddjobs
            <br />
            <img
              src="../img/logo.svg"
              alt="Oddjobs logo | Due to Evan MacDonald of the Noun Project (CC BY 3.0)"
              title="Oddjobs logo | Due to Evan MacDonald of the Noun Project (CC BY 3.0)"
          /></a>

          <ul class="nav-list">
            <li>
              <a href="../">Home</a>
            </li>
            <li>
              <a href="../join-on-up.html">Join On Up</a>
            </li>
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://oddjobs.flarum.cloud/"
                >Forum</a
              >
            </li>
            <li>
              <a href="../odd-jobs.html">Odd Jobs</a>
            </li>
            <li class="active">
              <a href="./">Guides</a>
            </li>
            <li>
              <a href="../dmg-calc/">Damage Calc</a>
            </li>
            <li>
              <a href="../gish-ap-calc/">Gish AP Calc</a>
            </li>
            <li>
              <a href="../archive/">Archive</a>
            </li>
            <li>
              <a href="../rankings/">Rankings</a>
            </li>
            <li>
              <a href="../source.html" data-jslicense="1">Source</a>
            </li>
          </ul>
        </div>
      </nav>

      <div id="content">
        <header>
          <h1>Guides</h1>
          <span class="subtitle"
            >The most esoteric videogame guides on the internet!</span
          >
        </header>

        <main>
          <ul>
"##;

static INDEX_POSTAMBLE: &[u8] = br##"          </ul>
        </main>
      </div>
    </div>
  </body>
</html>
"##;

static PREAMBLE0: &[u8] = br##"<!DOCTYPE html>
<html dir="ltr" lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Oddjobs | Guides | "##;

static PREAMBLE1: &[u8] = br##"</title>
    <meta name="description" content="The guild for MapleStory odd-jobbers" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />

    <link rel="stylesheet" type="text/css" href="../../css/style.css" />
    <link rel="icon" type="image/png" href="../../img/favicon.png" />
  </head>

  <body>
    <div id="nav-content-wrapper">
      <nav id="main-nav">
        <div id="main-nav-inner">
          <div id="main-nav-pullout"><span>&#x25b6;</span></div>

          <a href="../../" class="nav-h"
            >Oddjobs
            <br />
            <img
              src="../../img/logo.svg"
              alt="Oddjobs logo | Due to Evan MacDonald of the Noun Project (CC BY 3.0)"
              title="Oddjobs logo | Due to Evan MacDonald of the Noun Project (CC BY 3.0)"
          /></a>

          <ul class="nav-list">
            <li>
              <a href="../../">Home</a>
            </li>
            <li>
              <a href="../../join-on-up.html">Join On Up</a>
            </li>
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://oddjobs.flarum.cloud/"
                >Forum</a
              >
            </li>
            <li>
              <a href="../../odd-jobs.html">Odd Jobs</a>
            </li>
            <li class="active">
              <a href="../">Guides</a>
            </li>
            <li>
              <a href="../../dmg-calc/">Damage Calc</a>
            </li>
            <li>
              <a href="../../gish-ap-calc/">Gish AP Calc</a>
            </li>
            <li>
              <a href="../../archive/">Archive</a>
            </li>
            <li>
              <a href="../../rankings/">Rankings</a>
            </li>
            <li>
              <a href="../../source.html" data-jslicense="1">Source</a>
            </li>
          </ul>
        </div>
      </nav>

      <div id="content">
        <header>
          <!-- The HTML below this comment is automatically generated from a
          Markdown file by guide.rs.  See: <https://codeberg.org/oddjobs/pages>
          -->
"##;

static POSTAMBLE: &[u8] = br##"
        </main>
      </div>
    </div>
  </body>
</html>
"##;

static RANKINGS_PREAMBLE: &[u8] = br##"<!DOCTYPE html>
<html dir="ltr" lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Oddjobs | Rankings</title>
    <meta name="description" content="The guild for MapleStory odd-jobbers" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />

    <link rel="stylesheet" type="text/css" href="../css/style.css" />
    <link rel="icon" type="image/png" href="../img/favicon.png" />
  </head>

  <body>
    <div id="nav-content-wrapper">
      <nav id="main-nav">
        <div id="main-nav-inner">
          <div id="main-nav-pullout"><span>&#x25b6;</span></div>

          <a href="../" class="nav-h"
            >Oddjobs
            <br />
            <img
              src="../img/logo.svg"
              alt="Oddjobs logo | Due to Evan MacDonald of the Noun Project (CC BY 3.0)"
              title="Oddjobs logo | Due to Evan MacDonald of the Noun Project (CC BY 3.0)"
          /></a>

          <ul class="nav-list">
            <li>
              <a href="../">Home</a>
            </li>
            <li>
              <a href="../join-on-up.html">Join On Up</a>
            </li>
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://oddjobs.flarum.cloud/"
                >Forum</a
              >
            </li>
            <li>
              <a href="../odd-jobs.html">Odd Jobs</a>
            </li>
            <li>
              <a href="../guides/">Guides</a>
            </li>
            <li>
              <a href="../dmg-calc/">Damage Calc</a>
            </li>
            <li>
              <a href="../gish-ap-calc/">Gish AP Calc</a>
            </li>
            <li>
              <a href="../archive/">Archive</a>
            </li>
            <li class="active">
              <a href="./">Rankings</a>
            </li>
            <li>
              <a href="../source.html" data-jslicense="1">Source</a>
            </li>
          </ul>
        </div>
      </nav>

      <div id="content">
        <header>
          <!-- The HTML below this comment is automatically generated from a
          Markdown file by guide.rs.  See: <https://codeberg.org/oddjobs/pages>
          -->
"##;

pub fn render_index<P: AsRef<Path>, W: Write>(input_dir_path: P, out: &mut W) {
    out.write_all(INDEX_PREAMBLE).unwrap();

    for dir_entry in input_dir_path
        .as_ref()
        .read_dir()
        .expect("Could not read `input_dir_path` as a directory")
    {
        let dir_entry = dir_entry.unwrap();
        let dir_entry_name =
            dir_entry.file_name().into_string().expect("Bad `OsString`");

        if dir_entry.file_type().unwrap().is_dir()
            && !dir_entry_name.starts_with(".")
        {
            write!(
                out,
                r##"            <li><a href="./{}/">"##,
                dir_entry_name,
            )
            .unwrap();

            let mut readme_path = dir_entry.path();
            readme_path.push("README.md");

            let mut input_file = File::open(&readme_path)
                .expect("Could not open README.md file for reading");
            let mut input_str = String::new();
            input_file
                .read_to_string(&mut input_str)
                .expect("Could not read README.md file into memory");

            let peek_parser = Parser::new(
                input_str.split('\n').next().expect("No newlines in file"),
            );
            for event in peek_parser {
                match event {
                    Event::Start(tag) => {
                        if tag != Tag::Heading(1) {
                            eprintln!(
                                "Expected first element of {:?} to be a top-level heading",
                                &readme_path,
                            );

                            process::exit(1)
                        }
                    }
                    Event::Text(s) => {
                        out.write_all(html_esc(&s).as_bytes()).unwrap();
                    }
                    _ => break,
                }
            }

            out.write_all(b"</a></li>\n").unwrap();
        }
    }

    out.write_all(INDEX_POSTAMBLE).unwrap();
}

pub fn render<P: AsRef<Path>, W: Write>(
    input_file_path: P,
    rankings: bool,
    out: &mut W,
) {
    let mut input_file = File::open(input_file_path)
        .expect("Could not open input file for reading");
    let mut input_str = String::new();
    input_file
        .read_to_string(&mut input_str)
        .expect("Could not read input file into memory");

    let title_slug = if rankings {
        out.write_all(RANKINGS_PREAMBLE).unwrap();

        String::new()
    } else {
        out.write_all(PREAMBLE0).unwrap();

        let peek_parser = Parser::new(
            input_str.split('\n').next().expect("No newlines in file"),
        );
        let mut title_slug = String::new();
        for event in peek_parser {
            match event {
                Event::Start(tag) => {
                    if tag != Tag::Heading(1) {
                        eprintln!(
                            "Expected first element to be a top-level heading",
                        );

                        process::exit(1)
                    }
                }
                Event::Text(s) => {
                    out.write_all(s.as_bytes()).unwrap();
                    title_slug.push_str(&slugify(&s));
                }
                _ => break,
            }
        }

        out.write_all(PREAMBLE1).unwrap();

        title_slug
    };

    let parser = Parser::new_ext(&input_str, Options::ENABLE_TABLES);

    let mut seen_h1 = false;
    let mut in_heading = 0;
    let mut text = String::new();
    let mut table_alignments = Vec::new();
    let mut in_thead = false;
    let mut table_cell_ix = 0;
    let mut in_img = false;
    let (mut wanting_p, mut wanting_close_p) = (false, true);
    let mut wanting_a: Option<pulldown_cmark::CowStr> = None;
    let mut used_slugs = HashSet::new();
    for event in parser {
        if let Event::Text(_) = event {
        } else if !text.is_empty() {
            if in_heading != 0 {
                let slug = {
                    let mut s = slugify(&text);
                    let mut i = 1usize;
                    while used_slugs.contains(&s) {
                        if i == 1 {
                            s.push_str("-1");
                        } else {
                            s.truncate(
                                s.trim_end_matches(char::is_numeric).len(),
                            );
                            s.push_str(&i.to_string());
                        }

                        i += 1;
                    }

                    s
                };
                used_slugs.insert(slug.clone());

                if in_heading != 1 {
                    write!(out, r##"<a href="#{}" class="h-anchor">"##, slug)
                        .unwrap();
                }

                write!(out, r##"<h{} id="{}">"##, in_heading, slug).unwrap();
            }
            if !in_img {
                out.write_all(html_esc(&text).as_bytes()).unwrap();
            }

            text.truncate(0);
        }

        if wanting_p {
            match event {
                Event::Start(Tag::Link(_, _, _)) => (),
                _ => {
                    if let Event::Start(Tag::Image(_, _, _)) = event {
                        wanting_close_p = false;
                    } else {
                        out.write_all(b"<p>").unwrap();
                    }
                    wanting_p = false;

                    if let Some(url) = wanting_a.take() {
                        write!(out, r##"<a href="{}">"##, url).unwrap();
                    }
                }
            }
        }

        match event {
            Event::Start(tag) => match tag {
                Tag::Paragraph => wanting_p = true,
                Tag::Heading(level) => {
                    if level == 1 {
                        if seen_h1 {
                            eprintln!("Multiple `<h1>`s are not allowed");

                            process::exit(1);
                        }
                        seen_h1 = true;
                    }

                    in_heading = level as u8;
                }
                Tag::BlockQuote => out.write_all(b"<blockquote>").unwrap(),
                Tag::CodeBlock(_) => out.write_all(b"<pre>").unwrap(),
                Tag::List(ord) => out
                    .write_all(if ord.is_some() { b"<ol>" } else { b"<ul>" })
                    .unwrap(),
                Tag::Item => out.write_all(b"<li>").unwrap(),
                Tag::FootnoteDefinition(_) => unimplemented!(),
                Tag::Table(alignments) => {
                    out.write_all(br##"<div class="table-wrapper"><table>"##)
                        .unwrap();
                    table_alignments = alignments;
                }
                Tag::TableHead => {
                    out.write_all(b"<thead><tr>").unwrap();
                    in_thead = true;
                    table_cell_ix = 0;
                }
                Tag::TableRow => {
                    out.write_all(b"<tr>").unwrap();
                    table_cell_ix = 0;
                }
                Tag::TableCell => {
                    write!(
                        out,
                        r##"<t{} class="align-{}">"##,
                        if in_thead { r##"h scope="col""## } else { "d" },
                        match table_alignments[table_cell_ix] {
                            Alignment::None => "none",
                            Alignment::Left => "left",
                            Alignment::Center => "center",
                            Alignment::Right => "right",
                        },
                    )
                    .unwrap();
                    table_cell_ix += 1;
                }
                Tag::Emphasis => out.write_all(b"<em>").unwrap(),
                Tag::Strong => out.write_all(b"<strong>").unwrap(),
                Tag::Strikethrough => out.write_all(b"<del>").unwrap(),
                Tag::Link(_, url, _) => {
                    if wanting_p {
                        wanting_a = Some(url);
                    } else {
                        write!(out, r##"<a href="{}">"##, url).unwrap();
                    }
                }
                Tag::Image(_, url, title) => {
                    write!(
                        out,
                        r##"<figure><img loading="lazy" src="{}" alt="{}"
                            title="{}" />"##,
                        url, title, title,
                    )
                    .unwrap();
                    in_img = true;
                }
            },
            Event::End(tag) => match tag {
                Tag::Paragraph => {
                    if wanting_close_p {
                        out.write_all(b"</p>").unwrap();
                    }
                    wanting_p = false;
                    wanting_close_p = true;
                }
                Tag::Heading(level) => {
                    write!(out, "</h{}>", level).unwrap();

                    if in_heading != 1 {
                        out.write_all(b"</a>").unwrap();
                    }

                    if level == 1 {
                        if rankings {
                            out.write_all(br##"</header><main>"##).unwrap();
                        } else {
                            out.write_all(
                                br##"<a href="../"
                                 class="go-back">&#x2190;&nbsp;Back to
                                 Guides&nbsp;&#x2190;</a></header><main>"##,
                            )
                            .unwrap();
                        }
                    } else if !rankings {
                        write!(
                            out,
                            r##"<a href="#{}" class="go-back"
                                >&#x2191;&nbsp;Back to top&nbsp;&#x2191;</a
                                >"##,
                            title_slug,
                        )
                        .unwrap();
                    }

                    in_heading = 0;
                }
                Tag::BlockQuote => out.write_all(b"</blockquote>").unwrap(),
                Tag::CodeBlock(_) => out.write_all(b"</pre>").unwrap(),
                Tag::List(ord) => out
                    .write_all(if ord.is_some() { b"</ol>" } else { b"</ul>" })
                    .unwrap(),
                Tag::Item => out.write_all(b"</li>").unwrap(),
                Tag::FootnoteDefinition(_) => unimplemented!(),
                Tag::Table(_) => {
                    out.write_all(b"</tbody></table></div>").unwrap()
                }
                Tag::TableHead => {
                    out.write_all(b"</tr></thead><tbody>").unwrap();
                    in_thead = false;
                }
                Tag::TableRow => out.write_all(b"</tr>").unwrap(),
                Tag::TableCell => out
                    .write_all(if in_thead { b"</th>" } else { b"</td>" })
                    .unwrap(),
                Tag::Emphasis => out.write_all(b"</em>").unwrap(),
                Tag::Strong => out.write_all(b"</strong>").unwrap(),
                Tag::Strikethrough => out.write_all(b"</del>").unwrap(),
                Tag::Link(_, _, _) => {
                    out.write_all(b"</a>").unwrap();
                    wanting_a = None;
                }
                Tag::Image(_, _, _) => {
                    out.write_all(b"</figure>").unwrap();
                    in_img = false;
                }
            },
            Event::Text(s) => text.push_str(&s),
            Event::Code(s) => {
                write!(out, "<code>{}</code>", html_esc(&s)).unwrap();
            }
            Event::Html(s) => out.write_all(s.as_bytes()).unwrap(),
            Event::FootnoteReference(_) => unimplemented!(),
            Event::SoftBreak | Event::HardBreak => {
                out.write_all(b" ").unwrap();
            }
            Event::Rule => out.write_all(b"<hr />").unwrap(),
            Event::TaskListMarker(_) => unimplemented!(),
        }
    }

    out.write_all(POSTAMBLE).unwrap();
}

fn html_esc(s: &str) -> String {
    let mut escaped = String::with_capacity(s.len() + 4);

    for c in s.chars() {
        match c {
            '&' => escaped.push_str("&amp;"),
            '<' => escaped.push_str("&lt;"),
            '>' => escaped.push_str("&gt;"),
            _ => escaped.push(c),
        }
    }

    escaped
}
