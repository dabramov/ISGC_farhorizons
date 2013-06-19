#include <stdio.h>
#include <math.h>
#include <unistd.h>


int main()
{
  int i;
  char lbuf_kc9lhw[600],lbuf_wb9sky[600];

  FILE *fp_kc9lhw_i,*fp_wb9sky_i,*fp_kc9lhw_o,*fp_wb9sky_o;

  fp_kc9lhw_i=fopen("kc9lhwtrack.txt_old","r");
  fp_wb9sky_i=fopen("wb9skytrack.txt_old","r");
  fp_kc9lhw_o=fopen("kc9lhwtrack.txt","w");
  fp_wb9sky_o=fopen("wb9skytrack.txt","w");

  for (i=0;i<143;i++)
    {

      fgets(lbuf_kc9lhw,500,fp_kc9lhw_i);
      fgets(lbuf_wb9sky,500,fp_wb9sky_i);
      if (i>20) sleep(4);
      fputs(lbuf_kc9lhw,fp_kc9lhw_o);
      fputs(lbuf_wb9sky,fp_wb9sky_o);
      fflush(fp_kc9lhw_o);
      fflush(fp_wb9sky_o);
    }

  fclose(fp_kc9lhw_i);
  fclose(fp_wb9sky_i);
  fclose(fp_kc9lhw_o);
  fclose(fp_wb9sky_o);

  return 1;
}
