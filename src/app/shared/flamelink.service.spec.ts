import { TestBed } from '@angular/core/testing';

import { FlamelinkService } from './flamelink.service';

describe('FlamelinkService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FlamelinkService = TestBed.get(FlamelinkService);
    expect(service).toBeTruthy();
  });
});
