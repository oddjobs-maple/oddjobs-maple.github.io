mod guide;
mod odd_jobs;

use std::{env, io, process};

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
    } else if input_filename.ends_with(".md") {
        guide::render(input_filename, &mut stdout);
    } else {
        eprintln!("Expected input filename to end in \".json\" or \".md\"");

        process::exit(1)
    }
}
