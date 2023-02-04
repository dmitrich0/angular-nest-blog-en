import {Component, OnInit} from '@angular/core';
import {UserData, UserService} from "../../../services/user-service/user.service";
import {map} from "rxjs";
import {PageEvent} from "@angular/material/paginator";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  dataSource: UserData | null = null;
  pageEvent!: PageEvent;
  displayedColumns: string[] = ['id', 'name', 'username', 'email', 'role'];
  filterValue: string | null = null;

  constructor(
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.initDataSource();
  }

  initDataSource() {
    this.userService.findAll(1, 10).pipe(
      map((userData: UserData) => this.dataSource = userData)
    ).subscribe();
  }

  onPaginateChange(event: PageEvent) {
    const page = event.pageIndex + 1;
    const size = event.pageSize;
    if (this.filterValue === null) {
      this.userService.findAll(page, size).pipe(
        map((userData: UserData) => this.dataSource = userData)
      ).subscribe();
    } else {
      this.userService.paginateByName(page, size, this.filterValue).pipe(
        map((userData: UserData) => this.dataSource = userData)
      ).subscribe();
    }
  }

  findByName(username: string | null) {
    if (username) {
      this.userService.paginateByName(1, 10, username).pipe(
        map((userData: UserData) => this.dataSource = userData)
      ).subscribe();
    } else {
      this.userService.findAll(1, 10).pipe(
        map((userData: UserData) => this.dataSource = userData)
      ).subscribe();
    }
  }

  navigateToProfile(id: number): void {
    this.router.navigate(['./', id], {relativeTo: this.activatedRoute});
  }
}
