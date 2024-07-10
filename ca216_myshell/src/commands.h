/*
**
**  My Shell - CA216 Assignment 1
**  Source file: commands.h
**  Author: Ross McCann
**
**  File contains functions for all the builtin shell commands (cd, dir, etc...), and
**  contains functionality for execuitng external commands (child process of the shell).
**
*/

// includes
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <limits.h>
#include <dirent.h>
#include <sys/wait.h>

// prototypes
int cd_command(char **args);
int clr_command(void);
int dir_command(char **args);
int environ_command(void);
int echo_command(char **args);
int help_command(void);
int pause_command(void);
int quit_command(void);
int external_command(char **args);


// change directory function
int cd_command(char **args)
{
    if (args[1]) // if a directory has been provided
    {
        if (chdir(args[1]) == 0) // succesfull cd
        {
            setenv("PWD", args[1], 1);           
        }
        else
        {
            perror("cd failed\n"); // directory does not exist
        }
    }
    else // no directory provided
    {
        char cwd[PATH_MAX];
        getcwd(cwd, sizeof(cwd));
        printf("%s\n", cwd);
    }

    return 1;
}
// chdir usage: https://www.geeksforgeeks.org/chdir-in-c-language-with-examples/
// how to get cwd: https://stackoverflow.com/questions/298510/how-to-get-the-current-directory-in-a-c-program


// clear previous commands and outputs
int clr_command(void)
{
    system("clear");
    return 1;
}


// ls -al (list all files and (sub)directories - target folder argument)
int dir_command(char **args)
{
    DIR *dir;
    struct dirent *files;

    if (args[1]) // if a directory has been provided 
    {
        dir = opendir(args[1]);
    }
    else // open the current directory
    {
        dir = opendir(".");
    }

    if (dir) // make sure the directory exists
    {
        while ((files = readdir(dir)) != NULL)
            printf("%s\n", files->d_name);

        closedir(dir);
    }
    else
    {
        perror("dir failed\n");
    }
    
    return 1;
}
// ls -al implementation: https://www.geeksforgeeks.org/c-program-list-files-sub-directories-directory/


// function prints the environment strings of the program
int environ_command(void)
{
    extern char **environ;
    char **env = environ;

    for (; *env; ++env)
    {
        printf("%s\n", *env);
    }

    return 1;
}
// list environment strings: https://stackoverflow.com/questions/2085302/printing-all-environment-variables-in-c-c


// echo command reduces multiple spaces/tabs to one single space
int echo_command(char **args)
{
    int i = 1; // first arg is 1 as args[0] is the command
    int flag = 0; // used to track if the previous character was a space or tab

    while (args[i] != NULL) // iterate through all arguments
    {
        int j = 0; // used to track characters in an argument

        while (args[i][j] != '\0') // while the character is not the null terminator
        {
            if (args[i][j] == ' ' || args[i][j] == '\t')
            {
                if (!flag) // as long as the previous character was not a space or tab
                {
                    printf(" ");
                    flag = 1;  
                }
            }
            else
            {
                printf("%c", args[i][j]);
                flag = 0;
            }
            j++; // move the character forward
        }
        i++; // move the argument forward
        
        // print a space between arguments
        if (args[i] != NULL)
        {
            printf(" ");
        } 
    }
    printf("\n");
    return 1;
}


int help_command(void)
{
    system("more ../manual/readme");
    return 1;
}


// pauses the shell and waits for the user to press enter
int pause_command(void)
{
    printf("Press the enter key to return to the shell\n");

    char enter;
    enter = getchar();
    while(1) // infinite loop
    {
        if (enter == 10) // ASCII value of enter is 10;
        {
            return 1;
        }

        // if we get this far the user did not press enter
        enter = getchar();         
    }
}
// ASCII table: https://www.cs.cmu.edu/~pattis/15-1XX/common/handouts/ascii.html


// quits the shell
int quit_command(void)
{
    return 0;
}


// if a provided command is not builtin, shell will fork and exec it as a child process
#define PATH_BUFFER 1024
int external_command(char **args)
{
    // background execution states that if the command line ends in "&", then the shell
    // should return to the command line before finishing the process
    // here we will look for an &
    int background_exec = 0;
    int i = 0;
    while(args[i] != NULL)
    {
        if (strcmp(args[i], "&") == 0)
        {
            background_exec = 1;
            args[i] = NULL; // remove the & so it is not processed as a part of the command
            break;
        }
        i++;
    }

    // set environment entry for external programs
    char cwd[PATH_BUFFER];
    getcwd(cwd, sizeof(cwd));
    setenv("PARENT", strcat(cwd, "/myshell"), 1);
    
    pid_t pid = fork();
    int status;

    switch (pid)
    {
        case -1:
            perror("Fork failed\n");
            return 1;
        case 0: // this is the child process
            if (execvp(args[0], args) == -1) // execvp failure
            {
                perror("Child process could not execute command\n");
                exit(EXIT_FAILURE);
            }
            break;
        default: // this is the parent process
            if (!background_exec) // there was no & in the input
            {
                waitpid(pid, &status, WUNTRACED); // wait for the child
            }
            else // execute in the background
            {
                printf("Command will execute in the background\n");
            }
            break;
    }
    
    return 1;
}
// fork return values: https://man7.org/linux/man-pages/man2/fork.2.html
// execvp() usage: https://www.geeksforgeeks.org/exec-family-of-functions-in-c/
// exit child process: https://stackoverflow.com/questions/2329640/how-to-exit-a-child-process-exit-vs-exit
// inspiration: https://brennan.io/2015/01/16/write-a-shell-in-c/#how-shells-start-processes


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