#!/usr/bin/env bash

node ethereum/compile.js;
rm src/contract/*
cp ethereum/build/* src/contract/




