import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    public images: { src: string, alt: string }[] = [];
    public currentSlide = 0;
    public slidePosition = 0;
    public slideWidth = 0;

    public constructor(
        private alertService: AlertService
    ) { }

    public ngOnInit() {
        try {
            for (let i = 1; i < 76; i++) {
                this.images.push({ src: `assets/images/carousel-images/${i}.jpg`, alt: `Image ${i}` });
            }
            this.slideWidth = document.querySelector('.slide')?.clientWidth;

            setInterval(() => {
                // Increment the index of the currently displayed image
                if (this.currentSlide < this.images.length - 1) {
                    this.currentSlide++;
                    this.slidePosition -= this.slideWidth;
                }
            }, 3000); // Repeat every 3 seconds
        } catch (err: any) {
            this.alertService.error(err);
        }
    }

    public prevSlide() {
        try {
            if (this.currentSlide > 0) {
                this.currentSlide--;
                this.slidePosition += this.slideWidth;
            }
        } catch (err: any) {
            this.alertService.error(err);
        }
    }

    public nextSlide() {
        try {
            if (this.currentSlide < this.images.length - 1) {
                this.currentSlide++;
                this.slidePosition -= this.slideWidth;
            }
        } catch (err: any) {
            this.alertService.error(err);
        }
    }

    public onResize() {
        try {
            this.slideWidth = document.querySelector('.slide').clientWidth;
            this.slidePosition = -this.currentSlide * this.slideWidth;
        } catch (err: any) {
            this.alertService.error(err);
        }
    }

    public ngAfterViewInit() {
        try {
            this.onResize();
        } catch (err: any) {
            this.alertService.error(err);
        }
    }
}


