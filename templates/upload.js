import { html } from "#html";
import { BasePage } from "#templates/base.js";
import { FileUpload } from "#components/FileUpload.js";

export const UploadPage = (props = {}) =>
  html`
    <${BasePage}>
      <form
        x-data="{file: null, loading: false}"
        action="/upload"
        method="POST"
        enctype="multipart/form-data"
        @submit="loading=true"
      >
        <label
          for="file-upload"
          class="text-sm uppercase font-medium tracking-wide text-primary"
        >
          Report Upload
        </label>
        <div
          class="mt-2 flex justify-center rounded-lg bg-surface border-color-primary/20 border-1 border-dashed px-6 py-10"
        >
          <div class="flow-layout flow-sm">
            <p class="font-semibold">Upload OOTP Online League Report</p>
            <${FileUpload} name="file" />
            ${props.message && html`<p>${props.message}</p>`}
          </div>
        </div>
      </form>
    <//>
  `;
