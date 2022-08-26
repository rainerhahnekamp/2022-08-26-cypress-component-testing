import { parseAddress } from './parse-address';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class AddressLookuper {
  constructor(private httpClient: HttpClient) {}

  lookup(query: string): Observable<boolean> {
    parseAddress(query);
    return this.httpClient
      .get<unknown[]>('https://nominatim.openstreetmap.org/search.php', {
        params: new HttpParams().set('format', 'jsonv2').set('q', query)
      })
      .pipe(map((addresses) => addresses.length > 0));
  }

  // istanbul ignore next
  noop() {}
}
