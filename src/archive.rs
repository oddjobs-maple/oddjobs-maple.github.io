use crate::util::{capitalize, esc_html, slugify};
use serde::Deserialize;
use std::{
    cmp::Ordering,
    collections::HashMap,
    fs::{self, File},
    io::prelude::*,
    path::Path,
};

#[derive(Deserialize, Debug)]
struct Entries {
    entries: Vec<Entry>,
}

#[derive(Deserialize, Debug)]
struct Entry {
    title: String,
    date: toml::value::Datetime,
    media: Vec<String>,
    subjects: Vec<String>,
    domain: String,
    url: Option<String>,
    url_archived: Option<String>,
}

static INDEX_PREAMBLE: &[u8] = br##"<!DOCTYPE html>
<html dir="ltr" lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Oddjobs | Archive</title>
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
            <li class="active">
              <a href="./">Archive</a>
            </li>
            <li>
              <a href="../source.html" data-jslicense="1">Source</a>
            </li>
          </ul>
        </div>
      </nav>

      <div id="content">
        <header>
          <h1>Archive</h1>
          <span class="subtitle"
            >For all of the (surely many&hellip;) MapleStory
            historians/archaeologists of the future!</span
          >
        </header>

        <main>
          <p>
            This is an archive for content (primarily text and images) found
            &ldquo;in the wild&rdquo; that relates to odd jobs in MapleStory
            (any version thereof). Some videos are also included, but note that
            archival for videos is a tad bit more difficult (just due to sheer
            size, mostly), so most or all videos are left not-properly-archived
            (generally just raw YouTube URLs). The data presented here are
            rendered to this HTML from a single TOML file; see <a
            target="_blank" rel="noopener noreferrer"
            href="https://codeberg.org/oddjobs/odd-jobbed_archive"
            >https://codeberg.org/oddjobs/odd-jobbed_archive</a>.
          </p>

          <p>
            All entries are listed on this page, in chronological order. You
            can also click the links below to browse by medium (e.g.
            &ldquo;images&rdquo;), by subject matter, or by internet domain:
          </p>

          <ul>
            <li><a href="./medium/">Browse by medium</a></li>
            <li><a href="./subject/">Browse by subject matter</a></li>
            <li><a href="./domain/">Browse by internet domain</a></li>
          </ul>

          <!-- The HTML below this comment is automatically generated from a
          TOML file by archive.rs.  See: <https://codeberg.org/oddjobs/pages>
          -->
"##;

static INDEX_POSTAMBLE: &[u8] = br##"
        </main>
      </div>
    </div>
  </body>
</html>
"##;

static PLURAL_PREAMBLE: &str = r##"<!DOCTYPE html>
<html dir="ltr" lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Oddjobs | Archive | {{ plural_capitalized }}</title>
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
            <li>
              <a href="../../guides/">Guides</a>
            </li>
            <li>
              <a href="../../dmg-calc/">Damage Calc</a>
            </li>
            <li class="active">
              <a href="../">Archive</a>
            </li>
            <li>
              <a href="../../source.html" data-jslicense="1">Source</a>
            </li>
          </ul>
        </div>
      </nav>

      <div id="content">
        <header>
          <h1>Browse archive by {{ singular }}</h1>
          <a href="../" class="go-back">&#x2190;&nbsp;Back to main
          archive&nbsp;&#x2190;</a>
        </header>

        <main>
          <p>
            This is an archive for content (primarily text and images) found
            &ldquo;in the wild&rdquo; that relates to odd jobs in MapleStory
            (any version thereof). Some videos are also included, but note that
            archival for videos is a tad bit more difficult (just due to sheer
            size, mostly), so most or all videos are left not-properly-archived
            (generally just raw YouTube URLs). The data presented here are
            rendered to this HTML from a single TOML file; see <a
            target="_blank" rel="noopener noreferrer"
            href="https://codeberg.org/oddjobs/odd-jobbed_archive"
            >https://codeberg.org/oddjobs/odd-jobbed_archive</a>.
          </p>

          <p>
            This page lets you filter out entries, leaving only ones that
            {{ that }}.
          </p>

          <h2>{{ plural_capitalized }}</h2>

          <!-- The HTML below this comment is automatically generated from a
          TOML file by archive.rs.  See: <https://codeberg.org/oddjobs/pages>
          -->
"##;

static SINGULAR_PREAMBLE: &str = r##"<!DOCTYPE html>
<html dir="ltr" lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Oddjobs | Archive | {{ singular_capitalized }}: {{ item }}</title>
    <meta name="description" content="The guild for MapleStory odd-jobbers" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />

    <link rel="stylesheet" type="text/css" href="../../../css/style.css" />
    <link rel="icon" type="image/png" href="../../../img/favicon.png" />
  </head>

  <body>
    <div id="nav-content-wrapper">
      <nav id="main-nav">
        <div id="main-nav-inner">
          <div id="main-nav-pullout"><span>&#x25b6;</span></div>

          <a href="../../../" class="nav-h"
            >Oddjobs
            <br />
            <img
              src="../../../img/logo.svg"
              alt="Oddjobs logo | Due to Evan MacDonald of the Noun Project (CC BY 3.0)"
              title="Oddjobs logo | Due to Evan MacDonald of the Noun Project (CC BY 3.0)"
          /></a>

          <ul class="nav-list">
            <li>
              <a href="../../../">Home</a>
            </li>
            <li>
              <a href="../../../join-on-up.html">Join On Up</a>
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
              <a href="../../../odd-jobs.html">Odd Jobs</a>
            </li>
            <li>
              <a href="../../../guides/">Guides</a>
            </li>
            <li>
              <a href="../../../dmg-calc/">Damage Calc</a>
            </li>
            <li class="active">
              <a href="../../">Archive</a>
            </li>
            <li>
              <a href="../../../source.html" data-jslicense="1">Source</a>
            </li>
          </ul>
        </div>
      </nav>

      <div id="content">
        <header>
          <h1>Archive entries including the {{ singular }}: {{ item }}</h1>
          <a href="../" class="go-back">&#x2190;&nbsp;Back to
          browsing by {{ singular }}&nbsp;&#x2190;</a>
        </header>

        <main>
          <p>
            This is an archive for content (primarily text and images) found
            &ldquo;in the wild&rdquo; that relates to odd jobs in MapleStory
            (any version thereof). Some videos are also included, but note that
            archival for videos is a tad bit more difficult (just due to sheer
            size, mostly), so most or all videos are left not-properly-archived
            (generally just raw YouTube URLs). The data presented here are
            rendered to this HTML from a single TOML file; see <a
            target="_blank" rel="noopener noreferrer"
            href="https://codeberg.org/oddjobs/odd-jobbed_archive"
            >https://codeberg.org/oddjobs/odd-jobbed_archive</a>.
          </p>

          <p>
            This page only contains entries whose {{ singular }} matches
            &ldquo;{{ item }}&rdquo;.
          </p>

          <!-- The HTML below this comment is automatically generated from a
          TOML file by archive.rs.  See: <https://codeberg.org/oddjobs/pages>
          -->
"##;

pub fn render<P: AsRef<Path>, W: Write>(input_file_path: P, out: &mut W) {
    let mut input_file = File::open(input_file_path)
        .expect("Could not open input file for reading");
    let mut input_str = String::new();
    input_file
        .read_to_string(&mut input_str)
        .expect("Could not read input file into memory");

    let mut entries: Entries = toml::from_str(&input_str).unwrap();
    entries.entries.sort_by(|e0, e1| {
        let date_ordering = e0.date.to_string().cmp(&e1.date.to_string());
        if date_ordering != Ordering::Equal {
            date_ordering
        } else {
            e0.title.cmp(&e1.title)
        }
    });

    out.write_all(INDEX_PREAMBLE).unwrap();

    for entry in &entries.entries {
        write_entry(entry, "./", out);
    }

    out.write_all(INDEX_POSTAMBLE).unwrap();

    macro_rules! generate_filter {
        ($category:ident, $singular:literal, $plural:literal, $that:literal,) => {
            let mut plural_index = File::create(
                Path::new("./archive/").join($singular).join("index.html"),
            )
            .unwrap();
            let plural_capitalized = capitalize($plural);
            plural_index
                .write_all(
                    PLURAL_PREAMBLE
                        .replace(
                            "{{ plural_capitalized }}",
                            &plural_capitalized,
                        )
                        .replace("{{ singular }}", $singular)
                        .replace("{{ that }}", $that)
                        .as_bytes(),
                )
                .unwrap();

            write!(plural_index, "<ul>").unwrap();

            let plural: HashMap<_, _> = entries
                .entries
                .iter()
                .map(|e| e.$category.iter())
                .flatten()
                .map(|s| (slugify(s), s))
                .filter(|(slug, _)| !slug.is_empty())
                .collect();
            let mut plural_sorted: Vec<_> = plural.iter().collect();
            plural_sorted.sort_by(|(s0, _), (s1, _)| s0.cmp(s1));

            for (singular_slug, singular) in plural_sorted {
                write!(
                    plural_index,
                    r##"<li><a href="./{}/">{}</a></li>"##,
                    singular_slug, singular,
                )
                .unwrap();

                let singular_dir_path = Path::new("./archive/")
                    .join($singular)
                    .join(&singular_slug);
                fs::create_dir_all(&singular_dir_path).unwrap();
                let mut singular_index =
                    File::create(singular_dir_path.join("index.html"))
                        .unwrap();

                let singular_capitalized = capitalize($singular);
                singular_index
                    .write_all(
                        SINGULAR_PREAMBLE
                            .replace("{{ item }}", &singular)
                            .replace("{{ singular }}", $singular)
                            .replace(
                                "{{ singular_capitalized }}",
                                &singular_capitalized,
                            )
                            .as_bytes(),
                    )
                    .unwrap();

                for entry in entries.entries.iter().filter(|e| {
                    e.$category
                        .iter()
                        .map(|s| slugify(s))
                        .any(|s| &s == singular_slug)
                }) {
                    write_entry(entry, "../../", &mut singular_index);
                }

                singular_index.write_all(INDEX_POSTAMBLE).unwrap();
            }

            write!(plural_index, "</ul>").unwrap();

            plural_index.write_all(INDEX_POSTAMBLE).unwrap();
        };
    }

    macro_rules! generate_filter_uniq {
        ($category:ident, $singular:literal, $plural:literal, $that:literal,) => {
            let mut plural_index = File::create(
                Path::new("./archive/").join($singular).join("index.html"),
            )
            .unwrap();
            let plural_capitalized = capitalize($plural);
            plural_index
                .write_all(
                    PLURAL_PREAMBLE
                        .replace(
                            "{{ plural_capitalized }}",
                            &plural_capitalized,
                        )
                        .replace("{{ singular }}", $singular)
                        .replace("{{ that }}", $that)
                        .as_bytes(),
                )
                .unwrap();

            write!(plural_index, "<ul>").unwrap();

            let plural: HashMap<_, _> = entries
                .entries
                .iter()
                .map(|e| (slugify(&e.$category), &e.$category))
                .filter(|(slug, _)| !slug.is_empty())
                .collect();
            let mut plural_sorted: Vec<_> = plural.iter().collect();
            plural_sorted.sort_by(|(s0, _), (s1, _)| s0.cmp(s1));

            for (singular_slug, singular) in plural_sorted {
                write!(
                    plural_index,
                    r##"<li><a href="./{}/"><code>{}</code></a></li>"##,
                    singular_slug, singular,
                )
                .unwrap();

                let singular_dir_path = Path::new("./archive/")
                    .join($singular)
                    .join(&singular_slug);
                fs::create_dir_all(&singular_dir_path).unwrap();
                let mut singular_index =
                    File::create(singular_dir_path.join("index.html"))
                        .unwrap();

                let singular_capitalized = capitalize($singular);
                singular_index
                    .write_all(
                        SINGULAR_PREAMBLE
                            .replace("{{ item }}", &singular)
                            .replace("{{ singular }}", $singular)
                            .replace(
                                "{{ singular_capitalized }}",
                                &singular_capitalized,
                            )
                            .as_bytes(),
                    )
                    .unwrap();

                for entry in entries
                    .entries
                    .iter()
                    .filter(|e| &slugify(&e.$category) == singular_slug)
                {
                    write_entry(entry, "../../", &mut singular_index);
                }

                singular_index.write_all(INDEX_POSTAMBLE).unwrap();
            }

            write!(plural_index, "</ul>").unwrap();

            plural_index.write_all(INDEX_POSTAMBLE).unwrap();
        };
    }

    generate_filter!(
        media,
        "medium",
        "media",
        "include the chosen medium (e.g. only those that contain images)",
    );
    generate_filter!(
        subjects,
        "subject",
        "subjects",
        "include the chosen subject (e.g. only those that pertain to permabeginners)",
    );
    generate_filter_uniq!(
        domain,
        "domain",
        "domains",
        "were originally from the given internet domain (e.g. only those that were originally on <code>sleepywood.net</code>)",
    );
}

fn write_entry<P: AsRef<Path>, W: Write>(
    entry: &Entry,
    archive_pfx: P,
    out: &mut W,
) {
    let main_url = if let Some(url) = entry.url.as_ref() {
        url
    } else if let Some(url_archived) = entry.url_archived.as_ref() {
        url_archived
    } else {
        panic!("No URLs for entry with title: {}", entry.title)
    };

    writeln!(
        out,
        r##"<h2><a target="_blank" rel="noopener noreferrer"
            href="{}">{}</a></h2>"##,
        main_url,
        esc_html(&entry.title),
    )
    .unwrap();

    writeln!(
        out,
        r##"<p><time datetime="{}">{}</time></p>"##,
        entry.date, entry.date,
    )
    .unwrap();

    write!(out, "<p>").unwrap();
    if let Some(url) = entry.url.as_ref() {
        write!(
            out,
            r##"<a target="_blank" rel="noopener noreferrer"
                href="{}">&#x2728;&nbsp;Original</a>"##,
            url
        )
        .unwrap();
    }
    if let Some(url_archived) = entry.url_archived.as_ref() {
        write!(
            out,
            r##"{}<a target="_blank" rel="noopener noreferrer"
                href="{}">&#x1f5c4;&#xfe0f;&nbsp;Archived</a>"##,
            if entry.url.is_some() { " | " } else { "" },
            url_archived,
        )
        .unwrap();
    }
    write!(out, "</p>").unwrap();

    write!(out, "<table><tbody>").unwrap();

    write!(
        out,
        r##"<tr><th scope="row">Medi{}</th><td><ul class="inline-ul">"##,
        if entry.media.len() == 1 { "um" } else { "a" },
    )
    .unwrap();
    for medium in &entry.media {
        write!(
            out,
            r##"<li><a href="{}">{}</a></li>"##,
            archive_pfx
                .as_ref()
                .join("medium")
                .join(slugify(&medium))
                .join("")
                .to_string_lossy(),
            esc_html(&medium),
        )
        .unwrap();
    }
    writeln!(out, r##"</ul></td></tr>"##).unwrap();

    write!(
        out,
        r##"<tr><th scope="row">Subject{}</th><td><ul
            class="inline-ul">"##,
        if entry.subjects.len() == 1 { "" } else { "s" },
    )
    .unwrap();
    for subject in &entry.subjects {
        write!(
            out,
            r##"<li><a href="{}">{}</a></li>"##,
            archive_pfx
                .as_ref()
                .join("subject")
                .join(slugify(&subject))
                .join("")
                .to_string_lossy(),
            esc_html(&subject)
        )
        .unwrap();
    }
    writeln!(out, r##"</ul></td></tr>"##).unwrap();

    writeln!(
        out,
        r##"<tr><th scope="row">Domain</th><td><a
            href="{}"><code>{}</code></a></td></tr>"##,
        archive_pfx
            .as_ref()
            .join("domain")
            .join(slugify(&entry.domain))
            .join("")
            .to_string_lossy(),
        esc_html(&entry.domain),
    )
    .unwrap();

    writeln!(out, "</tbody></table>\n").unwrap();
}
