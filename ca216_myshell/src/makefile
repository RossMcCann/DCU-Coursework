# location to build into
dst = ../bin

# source files
srcs = myshell.c commands.h execution.h batchmode.h

# name of the executable
executable = $(dst)/myshell

# compiler
cc = gcc

$(executable): $(srcs)
	$(cc) -Wall $< -o $@

# reference: CA282 Intro to DevOps week 8 notes
# https://loop.dcu.ie/pluginfile.php/5389031/mod_resource/content/1/Week8.pdf