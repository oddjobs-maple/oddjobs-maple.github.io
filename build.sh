#!/usr/bin/env bash

set -ex

cargo update --aggressive
cargo build

./target/debug/oddjobs_renderer "$1" > ./odd-jobs.html

./target/debug/oddjobs_renderer "$2" > ./guides/index.html

declare -a guide_slugs=("woodsman" "str-cleric" "magelet" "swashbuckler" "introduction-to-odd-jobs")

for s in "${guide_slugs[@]}"
do
    ./target/debug/oddjobs_renderer "$2"/"$s"/README.md > ./guides/"$s"/index.html
    find "$2"/"$s"/ -type f \! \( -name '*.md' -o -name '*.bak' \) -exec cp "{}" ./guides/"$s"/ \;
done

./target/debug/oddjobs_renderer "$3" > ./archive/index.html

./target/debug/oddjobs_renderer "$4" --rankings > ./rankings/index.html

cd ./dmg-calc/
tsc
cd ..

rm -rf ./gish-ap-calc/
cp -dR "$5"/gish-ap-calc/ ./gish-ap-calc/
cd ./gish-ap-calc/
tsc
cd ..
