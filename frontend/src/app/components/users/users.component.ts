import {Component, OnInit} from '@angular/core';
import {UserData, UserService} from "../../services/user-service/user.service";
import {map, tap} from "rxjs";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  dataSource: UserData | null = null;
  pageEvent!: PageEvent;
  displayedColumns: string[] = ['id', 'name', 'username', 'email', 'role'];

  constructor(private userService: UserService) {
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
    console.log(`Page: ${page}, size:${size}`);
    this.userService.findAll(page, size).pipe(
      map((userData: UserData) => this.dataSource = userData)
    ).subscribe();
  }
}
