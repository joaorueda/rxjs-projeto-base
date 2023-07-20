import { Component } from '@angular/core';
import { EMPTY, catchError, debounceTime, distinctUntilChanged, filter, map, of, switchMap, tap, throwError } from 'rxjs';
import { Item } from 'src/app/models/interfaces';
import { LivroService } from 'src/app/service/livro.service';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { FormControl } from '@angular/forms';
import { LivrosResultado } from '../../models/interfaces';

const PAUSA = 300;

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css'],
})
export class ListaLivrosComponent {
  campoBusca = new FormControl();
  mensagemErro = '';
  livrosResultado: LivrosResultado;


  constructor(private service: LivroService) {}

  livrosEncontrados$ = this.campoBusca.valueChanges
  .pipe(
    debounceTime(PAUSA),
    filter((valorDigitado) => valorDigitado.length >= 3),
    tap(() => console.log('fluxo inicial')),
    // distinctUntilChanged(),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    map(res => this.livrosResultado = res),
    tap((res) => console.log('requisicao ao servidor : ', res)),
    map(res => res.items ?? []),
    map((items) => this.livrosResultadoParaLivros(items)),
    catchError(erro => {
      // this.mensagemErro = 'ops, phodeo!!!'
      // return EMPTY
      console.log(erro)
      return throwError(() => new Error(this.mensagemErro = 'ops, phodeo!!!'))
    })
  );

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map((item) => {
      return new LivroVolumeInfo(item);
    });
  }

}
