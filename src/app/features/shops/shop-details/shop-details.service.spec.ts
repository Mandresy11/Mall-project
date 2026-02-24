import { TestBed } from '@angular/core/testing';

import { ShopDetailsService } from './shop-details.service';

describe('ShopDetailsService', () => {
  let service: ShopDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShopDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
