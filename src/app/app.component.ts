import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PostService } from './post.service';
// import * as html2canvas from 'html2canvas';
import html2canvas from 'html2canvas';
import { from } from 'rxjs';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private url = 'http://localhost:3000/users';
  title = 'mock-api';
  posts: any;
  postwithid: any;
  alert: any;
  error: any;
  edit: any;
  addNews: any;
  post: any;
  isEdit: boolean = false;
  video: any;
  selectedCar;
  constructor(
    private httpClient: HttpClient,
    private service: PostService,
    private formBuilder: FormBuilder
  ) {}

  @ViewChild('screen') screen: ElementRef;
  @ViewChild('canvas') canvas: ElementRef<any>;
  @ViewChild('downloadLink') downloadLink: ElementRef;

  checkOutForm = this.formBuilder.group({
    username: '',
    country: '',
  });

  updatedForm = this.formBuilder.group({
    username: '',
    country: '',
  });
  private trigger: Subject<any> = new Subject();
  public webcamImage!: WebcamImage;
  private nextWebcam: Subject<any> = new Subject();
  sysImage = '';

  public get invokeObservable(): Observable<any> {
    return this.trigger.asObservable();
  }
  public get nextWebcamObservable(): Observable<any> {
    return this.nextWebcam.asObservable();
  }

  ngOnInit() {
    this.newFunc();
    this.getWithId();
    this.selectedCar = 'citizen';
    // this.video = document.querySelector('#webcam');
    // if (navigator.mediaDevices.getUserMedia) {
    //   navigator.mediaDevices
    //     .getUserMedia({ video: true })
    //     .then(function (stream) {
    //       this.video.srcObject = stream;
    //     })
    //     .catch(function (e) {
    //       console.log(e);
    //     });
    // }
  }

  modelChange(e) {
    this.selectedCar = e.target.value;
    console.log(e.target.value);
  }

  newFunc() {
    this.service.getPosts().subscribe((response) => {
      this.posts = response;
    });
  }

  getWithId() {
    this.httpClient.get(this.url + '/').subscribe((response) => {
      this.postwithid = response;
    });
  }

  onSubmit() {
    this.checkOutForm.valid &&
      this.httpClient.post(this.url, this.checkOutForm.value).subscribe({
        next: () => {
          this.alert = 'Successfully Created';
          this.newFunc();
        },
        error: () => (this.alert = 'Please Fill the fields Correctly'),
      });
    this.checkOutForm.reset();
  }

  onEdit(post: any) {
    this.edit = true;
    this.post = post;

    this.updatedForm.controls['username'].setValue(this.post.username);
    this.updatedForm.controls['country'].setValue(this.post.country);
  }

  onAddNews() {
    this.addNews = true;
  }

  onClose() {
    this.edit = false;
    this.addNews = false;
  }

  deleteApp(index: any) {
    console.log('Deleted', index.id);
    this.httpClient.delete(this.url + '/' + index.id).subscribe({
      next: (index) => {
        this.alert = 'Deleted ' + 'successfully';
        this.newFunc();
      },
      error: (index) => {
        this.error = 'There was an error Deleting ';
        console.error('There was an error! ');
      },
    });
  }

  updateNews(post: any) {
    this.httpClient
      .put(this.url + '/' + post.id, this.updatedForm.value)
      .subscribe({
        next: () => {
          this.alert = 'Updated Successfully';
          this.edit = false;
          this.newFunc();
        },
        error: (index) => {
          this.error = 'There was an error Updating ';
          console.error('There was an error! ');
        },
      });
  }
  //crop the image and draw it to the canvas
  // cropImage(x, y, s, z, u) {

  //   let video: any = document.getElementsByTagName('video')[0];

  //   //initialize the canvas object
  //   let canvas = document.createElement('canvas');
  //   let ctx = canvas.getContext('2d');

  //   //draw the image
  //   ctx.drawImage(video, 1, 100, 1600, 1200, 0, 0, 400, 800);

  //   let image = canvas.toDataURL('image/jpeg');
  //   console.log('image:' + image);
  // }

  captureShot() {
    console.log('clicked');
    let video: any = document.getElementsByTagName('video')[0];

    let canvas = document.createElement('canvas');

    canvas.width = 500;
    canvas.height = 300;

    let ctx = canvas.getContext('2d');
    ctx.drawImage(video, 200, 40, 350, 200, 0, 0, 500, 300);

    this.downloadLink.nativeElement.href = canvas.toDataURL('image/jpeg');
    this.downloadLink.nativeElement.download = 'citizenship.jpeg';
    this.downloadLink.nativeElement.click();
  }
}
