import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from 'src/app/services/request.service';
import { FullRequest } from 'src/app/new-request/full-request.model';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
transaction: FullRequest;
  constructor(private activatedRoute: ActivatedRoute,
              private requestService: RequestService,
              private router: Router) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('ref')) {
        // redirect
        return;
      }
      const ref = paramMap.get('ref') ;
      this.transaction = this.requestService.getRequest(ref);
      
    })
  }


  onCancel() {
    this.router.navigateByUrl('/inside');
  }
}
