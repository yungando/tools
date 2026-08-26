SHELL := zsh

SOURCE := $(CURDIR)/zsh
TARGET := $(HOME)/.oh-my-zsh/custom/plugins/tools

.PHONY: link-zsh

link-zsh:
	mkdir -p "$(dir $(TARGET))"
	ln -sfn "$(SOURCE)" "$(TARGET)"