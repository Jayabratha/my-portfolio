import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtGalleryComponent } from './art-gallery.component';

describe('GalleryComponent', () => {
  let component: ArtGalleryComponent;
  let fixture: ComponentFixture<ArtGalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtGalleryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
