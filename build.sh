#!/usr/bin/env bash

set -ex

cargo update --aggressive
cargo rustc --release -- -C target-cpu=native
strip ./target/release/oddjobs_renderer

./target/release/oddjobs_renderer "$1" > ./odd-jobs.html

declare -a guide_slugs=("woodsman" "str-cleric")

for s in "${guide_slugs[@]}"
do
    ./target/release/oddjobs_renderer "$2"/"$s"/README.md > ./guides/"$s"/index.html
    cp "$2"/"$s"/*.png ./guides/"$s"/
done
