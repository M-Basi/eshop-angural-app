import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {GoogleMap, MapMarker} from '@angular/google-maps';

@Component({
  selector: 'app-contact',
  imports: [
    // BrowserModule,
    // GoogleMap,
    // MapMarker
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  latitude = 38.025905291123465; // Replace with actual latitude
  longitude = 23.834516438861325; // Replace with actual longitude
  zoom = 15;

  email: String = 'example@gmail.com'



}
