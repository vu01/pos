import { Injectable } from "@angular/core";
import { Item } from "../models/item.model";
import { v4 as uuid } from "uuid";

@Injectable({
  providedIn: "root"
})
export class RegisterService {
  constructor() {}

  private itemList: Item[] = [];

  // @desc    Add new item to current order Item array
  // @params  name, unitPrice
  // @return  None
  public addItem(name: string, quantity: number, unitPrice: number) {
    if (this.itemExists(name)) {
      this.increaseQuantity(name);
    } else {
      let newItem = new Item();
      newItem.ItemID = uuid();
      newItem.Name = name;
      newItem.Quantity = quantity;
      newItem.UnitPrice = unitPrice;
      newItem.Subtotal = quantity * unitPrice;
      newItem.SubtotalString = (
        Math.round(newItem.Subtotal * 100) / 100
      ).toFixed(2);
      this.itemList.push(newItem);
    }
  }

  // @desc    Function to remove item from item array by id (used for "Remove" btn)
  // @params  id
  // @Return  None
  public removeItemById(id: string) {
    for (let i = 0; i < this.itemList.length; i++) {
      if (this.itemList[i].ItemID === id) {
        this.itemList.splice(i, 1);
      }
    }
  }

  // @desc    Function to remove item from item array by name (private method used for decreaseQuantity)
  // @params  itemName
  // @Return  None
  private removeItemByName(itemName: string) {
    for (let i = 0; i < this.itemList.length; i++) {
      if (this.itemList[i].Name === itemName) {
        this.itemList.splice(i, 1);
      }
    }
  }

  // @desc    Find item, then increment quantity.
  // @params  name
  // @Return  None
  public increaseQuantity(name: string) {
    for (let i = 0; i < this.itemList.length; i++) {
      if (this.itemList[i].Name === name) {
        this.itemList[i].Quantity++;
        let newSubtotal =
          this.itemList[i].Quantity * this.itemList[i].UnitPrice;
        // Used to round to 2 decimal places
        this.itemList[i].Subtotal =
          Math.round((newSubtotal + Number.EPSILON) * 100) / 100;
        // Forcing 2 decimal places (converts to string only)
        this.itemList[i].SubtotalString = (
          Math.round(this.itemList[i].Subtotal * 100) / 100
        ).toFixed(2);
      }
    }
  }

  // @desc    Find item, then increment quantity.
  // @params  name
  // @Return  None
  public decreaseQuantity(name: string) {
    for (let i = 0; i < this.itemList.length; i++) {
      if (this.itemList[i].Name === name) {
        // If quantity is 0, then remove it from the list.
        if (this.itemList[i].Quantity === 1) {
          this.removeItemByName(name);
        } else {
          this.itemList[i].Quantity--;
          let newSubtotal =
            this.itemList[i].Quantity * this.itemList[i].UnitPrice;
          // Used to round to 2 decimal places
          this.itemList[i].Subtotal =
            Math.round((newSubtotal + Number.EPSILON) * 100) / 100;
        }
      }
    }
  }

  // @desc    Returns true if item is already in basket.
  // @params  name
  // @Return  None
  private itemExists(name: string) {
    var exists = false;

    for (let i = 0; i < this.itemList.length; i++) {
      if (this.itemList[i].Name === name) {
        exists = true;
      }
    }
    return exists;
  }
}
