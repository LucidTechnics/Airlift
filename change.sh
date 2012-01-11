#!/bin/sh

git filter-branch --env-filter '

an="$GIT_AUTHOR_NAME"
am="$GIT_AUTHOR_EMAIL"
cn="$GIT_COMMITTER_NAME"
cm="$GIT_COMMITTER_EMAIL"

if [ "$GIT_COMMITTER_EMAIL" = "bediako@ubuntu" ]
then
    cn="Bediako George"
    cm="bediako.george@lucidtechnics.com"
fi
if [ "$GIT_AUTHOR_EMAIL" = "bediako@ubuntu" ]
then
    an="Bediako George"
    am="bediako.george@lucidtechnics.com"
fi
if [ "$GIT_COMMITTER_EMAIL" = "devnull@localhost" ]
then
    cn="Bediako George"
    cm="bediako.george@lucidtechnics.com"
fi
if [ "$GIT_AUTHOR_EMAIL" = "devnull@localhost" ]
then
    an="Bediako George"
    am="bediako.george@lucidtechnics.com"
fi


export GIT_AUTHOR_NAME="$an"
export GIT_AUTHOR_EMAIL="$am"
export GIT_COMMITTER_NAME="$cn"
export GIT_COMMITTER_EMAIL="$cm"
'	