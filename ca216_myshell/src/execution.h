/*
**
**  My Shell - CA216 Assignment 1
**  Source file: execution.h
**  Author: Ross McCann
**
**  File defines functions used for the general execution of the program.
**
*/

// ensure this header file is only compiled once
#ifndef EXECUTION_H
#define EXECUTION_H

// includes
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <fcntl.h>
#include "commands.h"

// prototypes
char *read_line(void);
char **shell_parser(char *input);
void io_redirection(char **args);
int command_execution(char **args);
int execution_loop(void);


char *read_line(void)
{
    char *line = NULL;
    size_t buf_size = 0; // line pointer is set to null so getline will allocate a buffer

    if (getline(&line, &buf_size, stdin) == -1)
    {
        if (feof(stdin))
        {
            exit(EXIT_SUCCESS);
        }
        else
        {
            perror("Could not read input line\n");
            exit(EXIT_FAILURE);
        }
    }
    return line;
}
// getline usage: https://man7.org/linux/man-pages/man3/getline.3.html
// read a line of user input: https://brennan.io/2015/01/16/write-a-shell-in-c/#reading-a-line


#define TOKEN_BUFFER 64
#define SEPARATORS " \t\n"
char **shell_parser(char *input)
{
    // allocate memory for an array of pointers to strings
    size_t buf_size = TOKEN_BUFFER;
    char **tokens = (char **)malloc(buf_size * sizeof(char *));
    if (!tokens) // error handling
    {
        perror("Could not allocate memory for shell input\n");
        exit(EXIT_FAILURE);
    }
    char *token;
    int token_number = 0;

    token = strtok(input, SEPARATORS);
    while (token != NULL)
    {
        // add current token pointer to the array
        tokens[token_number] = token;
        token_number++;

        if (token_number >= buf_size) // We're about to exceed the size of the array
        {
            char **temp = NULL; // placeholder for memory reallocation
            buf_size += TOKEN_BUFFER; // increase size of arguments
            temp = (char **)realloc(tokens, buf_size * sizeof(char *)); // increase array size
            if (!temp)
            {
                perror("Could not increase memory for shell input\n");
                exit(EXIT_FAILURE);
            }
            tokens = temp;
        }

        token = strtok(NULL, SEPARATORS); // get the next token
    }

    tokens[token_number] = NULL;
    return tokens; // function returns the array of tokens

    // NOTE: memory will need to be freed in the functions that use this function
}
// split a line into tokens: https://cplusplus.com/reference/cstring/strtok/
// store tokens in an array: https://brennan.io/2015/01/16/write-a-shell-in-c/#parsing-the-line


// global variables used to store stdin and stdout fileno will be used in execution loop
// to restore stdin and stdout if they are changed to a different filestream
int stdin_copy = -1;
int stdout_copy = -1;

void io_redirection(char **args)
{
    int i = 0;

    // loop through arguments to look for our redirection symbols
    while(args[i] != NULL)
    {
        // < means stdin will be redirected to the file specified
        if (strcmp(args[i], "<") == 0)
        {
            // check to make sure a file has been given
            if (args[i + 1] == NULL)
            {
                printf("No file provided to redirect stdin\n");
                exit(EXIT_FAILURE);
            }

            stdin_copy = dup(STDIN_FILENO); // hold stdin file number for reverting later
            freopen(args[i + 1], "r", stdin);
            args[i] = NULL; // remove redirect symbol from the command
            i++;
        }
        // > means stdout will be redirected and truncated to the specified file
        else if (strcmp(args[i], ">") == 0)
        {
            // check to make sure a file has been given
            if (args[i + 1] == NULL)
            {
                printf("No file provided to redirect stdout\n");
                exit(EXIT_FAILURE);
            }

            stdout_copy = dup(STDOUT_FILENO); // hold stdout file number for reverting later
            freopen(args[i + 1], "w", stdout);
            args[i] = NULL; // remove redirect symbol from the command
            i++;
        }
        // >> means stdout will be redirected and appended to the specified file
        else if (strcmp(args[i], ">>") == 0)
        {
            // check to make sure a file has been given
            if (args[i + 1] == NULL)
            {
                printf("No file provided to redirect stdout\n");
                exit(EXIT_FAILURE);
            }

            stdout_copy = dup(STDOUT_FILENO); // hold stdout file number for reverting later
            freopen(args[i + 1], "a", stdout);
            args[i] = NULL; // remove redirect symbol from the command
            i++;
        }
        i++;
    }
}
// freopen usage: https://www.tutorialspoint.com/c_standard_library/c_function_freopen.htm
// freopen description: https://www.ibm.com/docs/en/i/7.4?topic=functions-freopen-redirect-open-files
// fopen usage: https://www.tutorialspoint.com/c_standard_library/c_function_fopen.htm
// idea to restore stdin + stdout: https://c-faq.com/stdio/undofreopen.html


// checks user input and matches it to its associated command
int command_execution(char **args)
{
    if (args[0] == NULL)
    {
        return 1;
    }
    else if (strcmp(args[0], "cd") == 0)
    {
        return cd_command(args);    
    }
    else if (strcmp(args[0], "clr") == 0)
    {
        return clr_command();   
    }
    else if (strcmp(args[0], "dir") == 0)
    {
        io_redirection(args);
        return dir_command(args);   
    }
    else if (strcmp(args[0], "environ") == 0)
    {
        io_redirection(args);
        return environ_command();    
    }
    else if (strcmp(args[0], "echo") == 0)
    {
        io_redirection(args);
        return echo_command(args);
    }
    else if (strcmp(args[0], "help") == 0)
    {
        io_redirection(args);
        return help_command();        
    }
    else if (strcmp(args[0], "pause") == 0)
    {
        return pause_command();
    }
    else if (strcmp(args[0], "quit") == 0)
    {
        return quit_command();
    }
    else
    {
        io_redirection(args);
        return external_command(args);
    }
}


#define PATH_BUFFER 1024
int execution_loop(void)
{
    // set SHELL environment variable to /myshell
    char cwd[PATH_BUFFER];
    getcwd(cwd, sizeof(cwd));
    setenv("SHELL", strcat(cwd, "/myshell"), 1);

    char *line;
    char **args;
    int return_value;

    do
    {
        // print the command line prompt
        printf("%s\n==> ", cwd);

        fflush(stdout);

        line = read_line();
        args = shell_parser(line);
        return_value = command_execution(args);

        // constantly check the cwd incase we execute cd
        getcwd(cwd, sizeof(cwd));

        // if we have redirected stdin we now need to change the stdin stream back to STDIN
        if (stdin_copy != 1)
        {
            dup2(stdin_copy, STDIN_FILENO);
            close(stdin_copy);
            stdin_copy = -1;
        }

        // if we have redirected stout we now need to change the stdout stream back to STDOUT
        if (stdout_copy != -1)
        {
            fflush(stdout);
            dup2(stdout_copy, STDOUT_FILENO);
            close(stdout_copy);
            stdout_copy = -1;
        }

        free(line);
        free(args);
    } while(return_value); // quit command returns a 0 - all other commands return 1

    // in order to get this far, the user typed quit, so we can return 0 here and use it in 
    // the main to exit the shell.
    return 0;
}
// shell looping: https://brennan.io/2015/01/16/write-a-shell-in-c/#basic-loop-of-a-shell
// idea to restore stdin + stdout: https://c-faq.com/stdio/undofreopen.html

#endif /* EXECUTION_H */

/*
**
**  ACKNOWLEDGEMENT OF DCU ACADEMIC INTEGRITY POLICY:
**  I declare that all work & ideas presented in this project, have been completed and
**  presented in accordance with the DCU Academic Integrity Policy. All work presented is
**  my own work, except where i have stated otherwise.
**
**  Student Number: ********
**  Student Name: Ross McCann
**  
*/