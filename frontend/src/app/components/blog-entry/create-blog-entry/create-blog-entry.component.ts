import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BlogService} from "../../../services/blog-service/blog.service";
import {catchError, map, of, tap} from "rxjs";
import {HttpErrorResponse, HttpEvent, HttpEventType} from "@angular/common/http";
import {Router} from "@angular/router";

export interface IFile {
  data: any;
  progress: number;
  inProgress: boolean;
}

@Component({
  selector: 'app-create-blog-entry',
  templateUrl: './create-blog-entry.component.html',
  styleUrls: ['./create-blog-entry.component.scss']
})
export class CreateBlogEntryComponent implements OnInit {
  @ViewChild('fileUpload', {static: false}) fileUpload!: ElementRef;
  file: IFile = {
    data: null,
    inProgress: false,
    progress: 0
  };

  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private blogService: BlogService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [{value: null, disabled: true}],
      title: [null, [Validators.required]],
      slug: [{value: null, disabled: true}],
      description: [null, [Validators.required]],
      body: [null, [Validators.required]],
      headerImage: [null, [Validators.required]]
    });
  }

  post() {
    this.blogService.post(this.form.getRawValue()).pipe(
      tap(() => {
        this.router.navigate(['']);
      })
    ).subscribe();
  }

  onClick() {
    const fileInput = this.fileUpload.nativeElement;
    fileInput.click();
    fileInput.onchange = () => {
      this.file = {
        data: fileInput.files[0],
        inProgress: false,
        progress: 0
      };
      this.fileUpload.nativeElement.value = '';
      this.uploadFile();
    };
  }

  uploadFile() {
    const formData = new FormData();
    formData.append('file', this.file.data);
    this.file.inProgress = true;
    this.blogService.uploadHeaderImage(formData).pipe(
      // @ts-ignore
      map((e: HttpEvent<any>) => {
        switch (e.type) {
          case HttpEventType.UploadProgress:
            // @ts-ignore
            this.file.progress = Math.round(e.loaded * 100 / e.total);
            break;
          case HttpEventType.Response:
            return e;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.file.inProgress = false;
        return of('Upload failed');
      })
    ).subscribe((event: any) => {
      if (typeof event === 'object') {
        this.form.patchValue({
          headerImage: event.body.filename
        });
      }
    });
  }
}
