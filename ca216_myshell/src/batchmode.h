/*
**
**  My Shell - CA216 Assignment 1
**  Source file: batchmode.h
**  Author: Ross McCann
**
**  File contains functionality of the shell running in "batch mode" where command line input
**  is a file assumed to contain a set of commands on each line for the shell to process. shell 
**  should exit at the eof.
**
*/

// includes
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "execution.h"

// prototypes
int batch_mode(char const *filename);


int batch_mode(char const *filename)
{
    // open the file passed to the function
    FILE *file = fopen(filename, "r");
    if (!file)
    {
        perror("Could not open batchfile\n");
        exit(EXIT_FAILURE);
    }

    // init a line to read arguments and an array to store tokens in
    char *line = NULL;
    char **args;
    size_t buf_size = 0;

    while(getline(&line, &buf_size, file) != -1)
    {
        args = shell_parser(line);
        command_execution(args);

        free(line);
        free(args);
        line = NULL;
    }

    // close the file to finish the function
    fclose(file);
    return 0;
}
// function is basically an amalgamation of read_line() and execution_loop() in execution.h


/*
**
**  ACKNOWLEDGEMENT OF DCU ACADEMIC INTEGRITY POLICY:
**  I declare that all work & ideas presented in this project, have been completed and
**  presented in accordance with the DCU Academic Integrity Policy. All work presented is
**  my own work, except where i have stated otherwise.
**
**  Student Number: 22343526
**  Student Name: Ross McCann
**  
*/