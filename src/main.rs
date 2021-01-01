#![forbid(unsafe_code)]
#![deny(clippy::all)]
#![deny(deprecated)]

mod archive;
mod guide;
mod odd_jobs;
mod util;

use std::{env, io, path::Path, process};

fn main() {
    let mut input_filename = String::new();

    for (arg_i, arg) in env::args().enumerate() {
        match arg_i {
            0 => (),
            1 => input_filename = arg,
            _ => {
                eprintln!(
                    "Expected exactly one argument: the filename to read in",
                );

                process::exit(1)
            }
        }
    }

    if input_filename.is_empty() {
        eprintln!("Expected exactly one argument: the filename to read in");

        process::exit(1)
    }

    let stdout = io::stdout();
    let mut stdout = stdout.lock();

    if input_filename.ends_with(".json") {
        odd_jobs::render(input_filename, &mut stdout);
    } else if input_filename.ends_with(".md")
        || input_filename.ends_with(".markdown")
    {
        guide::render(input_filename, &mut stdout);
    } else if input_filename.ends_with(".toml") {
        archive::render(input_filename, &mut stdout);
    } else if Path::new(&input_filename).is_dir() {
        guide::render_index(input_filename, &mut stdout);
    } else {
        eprintln!("Expected input filename to end in \".json\" or \".md\"/\".markdown\", or for the input filename to point to a directory");

        process::exit(1)
    }
}
