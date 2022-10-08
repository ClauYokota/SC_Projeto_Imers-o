import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostEnderecoComponent } from './post-endereco.component';

describe('PostEnderecoComponent', () => {
  let component: PostEnderecoComponent;
  let fixture: ComponentFixture<PostEnderecoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostEnderecoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostEnderecoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
