#include <stdio.h>   /* Standard input/output definitions */
#include <stdlib.h>
#include <string.h>  /* String function definitions */
#include <unistd.h>  /* UNIX standard function definitions */
#include <fcntl.h>   /* File control definitions */
#include <errno.h>   /* Error number definitions */
#include <termios.h> /* POSIX terminal control definitions */
#include <time.h>
#include <math.h>
#include "skyalgorithms.h"

/*
 * 'open_port()' - Open serial port 1.
 *
 * Returns the file descriptor on success or -1 on error.
 */

int open_port(char SerialFileName[])
{
  int fd; /* File descriptor for the port */
  
  
  fd = open(SerialFileName, O_RDWR | O_NOCTTY | O_NDELAY);
  if (fd == -1)
    {
      /*
       * Could not open the port.
       */
      
      fprintf(stderr,"open_port: Unable to open - %s \n",SerialFileName);
      exit(-1);
    }
  else
    fcntl(fd, F_SETFL, 0);
  
  return (fd);
}

int close_port(int fd)
{
  close(fd);
}



int main()
{
  int fd,n,i;
  char linebuff[200];
  char logfilename[200];
  time_t tp;
  struct tm *ct;
  struct date_time T;
  double jd;
  int jd_rounded;
  FILE *lfp;


  /* start by opening a log file with name based on the julian day:
     "logAPRS_JulianDayNumber.dat"
     if file exists then simply append
 */ 

  /* get the time and then julian date */
  time(&tp);
  ct=localtime(&tp);
  T.y=ct->tm_year+1900;
  T.mo=ct->tm_mon+1;
  T.d=ct->tm_mday;
  T.h=ct->tm_hour;
  T.mn=ct->tm_min;
  T.s=ct->tm_sec;

  jd=date_to_jd(T);
  jd_rounded=(int) (jd-0.5);

  printf("%d\n",tp);
  printf("%d\n",jd_rounded);

  sprintf(logfilename,"APRS_%7d.log",jd_rounded);

  lfp=fopen(logfilename,"a");


  fd=open_port("/dev/tty.KeySerial1");

  /*  fcntl(fd, F_SETFL, FNDELAY);*/
  strcpy(linebuff," ");
  //  for (i=0;strchr(linebuff,'Q')==NULL;i++)
  for (i=0;;)
    {
      n=read(fd,linebuff,10);
      if (n>0){
	linebuff[n]='\0';
	//    printf("||| %d |||\n",n);
	fprintf(lfp,"%s",linebuff);
	fflush(lfp);
      }

    }

  fcntl(fd, F_SETFL, 0);

  close_port(fd);
  fclose(lfp);

  return 1;
}


#include "skyalgorithms.c"
