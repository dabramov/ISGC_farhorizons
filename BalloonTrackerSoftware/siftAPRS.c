#include <stdio.h>
#include <string.h>
#include "csystem.h"

#define MAXPACKETLEN 200


int main()
{

  char packet[MAXPACKETLEN+1],a;
  FILE *fpi,*fpo;
  FILE *fp1,*fp2,*fp3;
  int i,j;
  int t_h,t_m,t_s;
  int lat_d,lat_m_ip,lat_m_dp;
  int long_d,long_m_ip,long_m_dp;
  int direction,speed;
  int Altitude;
  double lat_m;
  double long_m;
  char *p;



  for (j=0;j<50000;j++)
    {

      /* open log file */
      fpi=fopen("APRS_2455730.log","r");
      
      /* open output files */
      fp1=fopen("kc9lhwtrack.txt","w");
      fp2=fopen("kc9ligtrack.txt","w");
      fp3=fopen("wb9skytrack.txt","w");
      
      for (;!(feof(fpi));)
	{
	  /* start adding characters to the buffer*/
	  /* if we hit a "", an end of file or run out of room then stop. */
	  /* this is our packet */
	  for (i=0;(!(feof(fpi))&&
		    ((packet[i]=fgetc(fpi))!=13)&&
		    (i<MAXPACKETLEN));i++);
	  
	  /* terminate the packet string with an \0 */
	  packet[++i]='\0';
	      	  printf("%s\n",packet);
	  
		  	  if (strstr(packet,"UI-View")!=NULL) continue;
		  //	  if (strstr(packet,"N9I")!=NULL) continue;
		  //	  if (strstr(packet,"::")!=NULL) continue;

      /* see if it has KC9LHW, KC9LIG, or WB9SKY in it */
      /* (assuming these are at the beginning) */
      /*   printf("%s",packet);*/
	  
	  if ((strstr(packet,"\nKC9LHW-11")!=NULL)||
      	      (strstr(packet,"\nKC9LIG-11")!=NULL)||
	      (strstr(packet,"\nWB9SKY-11")!=NULL))
	    {

	      printf("one of Ours! \n");
	      if (strstr(packet,"KC9LHW")!=NULL) fpo=fp1;
      	      if (strstr(packet,"KC9LIG")!=NULL) fpo=fp2;
	      if (strstr(packet,"WB9SKY")!=NULL) fpo=fp3;
	      
	      /* extract time, location, altitude and other data */
	      /* skip preliminary data and go to start of data string */
	      /* extract time information. */
	      p=strstr(packet,":!");
	      //	      sscanf(p+2,"%2d%2d%2d",&t_h,&t_m,&t_s);
	      //	      printf("%d %d %d\n",t_h,t_m,t_s);
	      
	      /* jump to "z" and extract the latitude*/
	      //	      p=strstr(p,"z");
	      sscanf(p+2,"%2d%2d.%2d",&lat_d,&lat_m_ip,&lat_m_dp);
	      
	      lat_m=lat_m_ip+lat_m_dp/100.0;
	      fprintf(fpo,"%lf,",lat_d+lat_m/60.0);
	      
	      /* jump to "N/" and extract the longitude*/
	      p=strstr(p,"N/");
	      sscanf(p+2,"%3d%2d.%2d",&long_d,&long_m_ip,&long_m_dp);
	      
	      long_m=long_m_ip+long_m_dp/100.0;
	      fprintf(fpo,"%lf,",-(long_d+long_m/60.0));
	      
	      /* jump to "WO" and extract the direction and speed */
	      p=strstr(p,"WO");
	      sscanf(p+2,"%3d/%3d",&direction,&speed);
	      
      	      fprintf(fpo,"%d,%d,",direction,speed);
	      
	      /* jump to "/A=" and extract the Altitude */
	      p=strstr(p,"/A=");
	      sscanf(p+3,"%6d",&Altitude);
	      
	      fprintf(fpo,"%d\n",Altitude);
	      
	    }
	  
	} 
      fclose(fpi);
      fclose(fp1);      
      fclose(fp2);      
      fclose(fp3);      
            system("cp kc9lhwtrack.txt /Users/ggyuk/Sites");
        system("cp kc9ligtrack.txt /Users/ggyuk/Sites");
       system("cp wb9skytrack.txt /Users/ggyuk/Sites");
      sleep(10);
    
    }
 
  return 1; 
}


#include "csystem.h"
