# tiny-compiler

This is a sample compiler for compiling parts of the lisp's syntax to c.

[From this repo](https://github.com/jamiebuilds/the-super-tiny-compiler)

## Build

```sh
npm run build
```

## Usage

Example of input lisp code:

`in.lsp`

```lsp
(add (sub 1 2) 2)
(concat "" (concat "a" "bcd"))
```
Compile:

```sh
./bin/lcc ./in.lsp -o out.c
```

The output c code:

`out.c`

```c
add(sub(1,2),2);
concat("a",concat("a","b"));
```