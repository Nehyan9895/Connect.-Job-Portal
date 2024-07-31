import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jobType',
  standalone: true
})
export class JobTypePipe implements PipeTransform {

  private jobTypeMapping: { [key: string]: string } = {
    full_time: 'Full Time',
    part_time: 'Part Time',
    contract_based: 'Contract Based'
  };

  transform(value: string){
    return this.jobTypeMapping[value] || value;
  }


}
