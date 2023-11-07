/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office */

Office.onReady((info) => {
  if (info.host === Office.HostType.Outlook) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";

    const item = Office.context.mailbox.item;
    document.getElementById("message").innerHTML =
      item.subject + "<br />" + item.sender.displayName + "<br />" + item.sender.emailAddress;
    item.body.getAsync(Office.CoercionType.Text, function (result) {
      document.getElementById("message").innerHTML += "<br />" + result.value;
    });
  }
});
