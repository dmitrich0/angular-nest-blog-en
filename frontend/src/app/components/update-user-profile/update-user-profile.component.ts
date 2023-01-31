import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService, User} from "../../services/auth-service/auth.service";
import {UserService} from "../../services/user-service/user.service";
import {catchError, map, of, switchMap, tap} from "rxjs";
import {HttpErrorResponse, HttpEvent, HttpEventType} from "@angular/common/http";

export interface IFile {
  data: any;
  progress: number;
  inProgress: boolean;
}

@Component({
  selector: 'app-update-user-profile',
  templateUrl: './update-user-profile.component.html',
  styleUrls: ['./update-user-profile.component.scss']
})
export class UpdateUserProfileComponent implements OnInit {
  @ViewChild('fileUpload', {static: false}) fileUpload!: ElementRef;
  file: IFile = {
    data: null,
    inProgress: false,
    progress: 0
  }
  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [{value: null, disabled: true}, [Validators.required]],
      name: [null, [Validators.required]],
      username: [null, [Validators.required]],
      profileImage: [null]
    });

    this.authService.getUserId().pipe(
      switchMap((id: number) => this.userService.findOne(id).pipe(
        tap((user: User) => {
          this.form.patchValue({
            id: user.id,
            name: user.name,
            username: user.username,
            profileImage: user.profileImage
          });
        })
      ))
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
    }
  }

  uploadFile() {
    const formData = new FormData();
    formData.append('file', this.file.data);
    this.file.inProgress = true;
    this.userService.uploadProfileImage(formData).pipe(
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
          profileImage: event.body.profileImage
        });
      }
    });
  }

  update() {
    this.userService.updateOne(this.form.getRawValue()).subscribe();
  }

}
