fpath=("${0:A:h}" $fpath)

autoload -Uz compinit
if ! whence -w _main_complete >/dev/null 2>&1; then
  compinit
fi
