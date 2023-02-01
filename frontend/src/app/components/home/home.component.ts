import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {IBlogEntriesPagable} from "../../models/blog-entry.interface";
import {BlogService} from "../../services/blog-service/blog.service";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private blogService: BlogService) {
  }

  ngOnInit(): void {
  }
}
