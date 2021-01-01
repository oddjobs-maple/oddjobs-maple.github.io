#!/usr/bin/env bash

set -ex

cargo update --aggressive
cargo build

./target/debug/oddjobs_renderer "$1" > ./odd-jobs.html

./target/debug/oddjobs_renderer "$2" > ./guides/index.html

declare -a guide_slugs=("woodsman" "str-cleric" "magelet")

for s in "${guide_slugs[@]}"
do
    ./target/debug/oddjobs_renderer "$2"/"$s"/README.md > ./guides/"$s"/index.html
    cp "$2"/"$s"/*.png ./guides/"$s"/
done

./target/debug/oddjobs_renderer "$3" > ./archive/index.html

cd ./dmg-calc/
tsc
cd ..
