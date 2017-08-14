import { Component, OnInit } from '@angular/core';
import { YoutubeGetVideo } from '../config/youtube.config';
import { AppComponent } from '../app.component';
import { SharedService } from '../config/shared.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-search',
  templateUrl: 'youtube-search.component.html'
})

export class SearchComponent implements OnInit {

  searchForm: FormGroup;
  thumbnails = false;

  videos: any;
  feedVideos: any;
  channel: any;

  _shared: any;
  _app: any;

  trendingFirst = {
      bannerURL: '',
      video: {
        id: '',
        title: '',
        img: '',
        stats: {
          views: '',
          likes: '',
          dislikes: ''
        }
      },
      stats: {
        subscribers: '',
        views: '',
        videoCount: ''
      }
  }

  private listGrid = true;

  constructor(
    private youtube: YoutubeGetVideo,
    private shared: SharedService,
    private app: AppComponent
  ) {
    this._shared = shared;
    this._app = app;
  }

  ngOnInit() {
    console.log('search');
    this.getSettings();
    this.searchFunction();
    this.getFeedVideos();
  }

  searchFunction() {
    this.searchForm = new FormGroup({
      searchInput: new FormControl('', [Validators.required, Validators.minLength(2)])
    });

    this.searchForm.valueChanges.subscribe((form) => {
        this.youtube.searchVideo(form.searchInput).subscribe(
          result => {
            if (!this.searchForm.invalid) {
              this.videos = result.items;
            } else {
              this.videos = null;
            }
          },
          error => {
            console.log('error on search');
          }
        );
    });
  }

  getSettings() {
    this._shared.getSettings().subscribe(data => {
        this.thumbnails = data.form_settings[1].value;
    });
  }

  getFeedVideos() {
      this._shared.getFeed().subscribe(data => {
          this.feedVideos = data;
          this.getChannelTrending(this.feedVideos[0].snippet.channelId);
      });
  }

  getChannelTrending(query: any) {
      this._shared.getChannel(query).subscribe(data => {
          this.feedVideos = this._shared.feedVideos;
          this.channel = this._shared.channel;
          this.trendingFirst.video.id = this.feedVideos[0].id;
          this.trendingFirst.video.title = this.feedVideos[0].snippet.title;
          this.trendingFirst.video.img = this.feedVideos[0].snippet.thumbnails.medium.url;
          this.trendingFirst.video.stats.likes = this.feedVideos[0].statistics.likeCount;
          this.trendingFirst.video.stats.dislikes = this.feedVideos[0].statistics.dislikeCount;
          this.trendingFirst.video.stats.views = this.feedVideos[0].statistics.viewCount;

          this.trendingFirst.bannerURL = this.channel.items[0].brandingSettings.image.bannerTabletHdImageUrl;
          if (!this.channel.items[0].statistics.hiddenSubscriberCount) {
            this.trendingFirst.stats.subscribers = this.channel.items[0].statistics.subscriberCount;
          } else {
            this.trendingFirst.stats.subscribers = '0';
          }
          this.trendingFirst.stats.videoCount = this.channel.items[0].statistics.videoCount;
          this.trendingFirst.stats.views = this.channel.items[0].statistics.viewCount;
          this.feedVideos.shift();
      });
  }

  clearSearch() {
    this.searchForm.reset();
    this.videos = null;
  }

  onSubmit(event: Event) {
    event.preventDefault();
  }

  onClickVideo(event: Event, i: any, list: number) {
    if (list === 1) {
      this._app.getVideo(this.videos[i]);
      this.clearSearch();
    } else if (list === 3) {
      this._app.getVideo(this.feedVideos[i]);
    }
  }

  setSettings(data: any, from: number) {
    if (from === 0) {
      this.thumbnails = data[from].value;
    }
  }

  toggleList(int: number) {
    if (int === 1) {
      this.listGrid = false;
    } else {
      this.listGrid = true;
    }
  }

}
