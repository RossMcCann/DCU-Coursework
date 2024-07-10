/*
**
**  My Shell - CA216 Assignment 1
**  Source file: myshell.c
**  Author: Ross McCann
**  
**  All references used in this project will be commented underneath the code block in
**  which they appear.
**
**  Acknowledgement of the DCU Academic Integrity Policy will be commented at the end of
**  of each submitted file.
**
*/

// includes
#include <stdio.h>
#include <stdlib.h>
#include "execution.h"
#include "batchmode.h"


int main(int argc, char const *argv[])
{
    if (argc == 2) // batchfile has been provided
    {
        return batch_mode(argv[1]); // execute the shell in batch mode
    }

    return execution_loop(); // execute the shell in interactive mode
}


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