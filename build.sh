#!/usr/bin/env bash

set -ex

cargo update --aggressive
cargo rustc --release -- -C target-cpu=native
strip ./target/release/oddjobs_renderer
./target/release/oddjobs_renderer "$1" > ./odd-jobs.html
