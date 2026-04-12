import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import EditJobs from "../EditJobs";
import { jobPostingApi } from "../../../utils/api";
import * as validation from "../../../utils/validation/validateCreateJobForm";
jest.mock("../../../utils/api", () => ({ jobPostingApi: { update: jest.fn() } }));
jest.mock("../../../utils/validation/validateCreateJobForm", () => ({
  validateCreateJobForm: jest.fn(),
}));
const jobDetails = { _id: "j1", title: "Frontend Dev", location: "Remote", description: "UI work", tags: [], author: "TechCorp", status: "ACTIVE" };
const makeProps = () => ({ setXButton: jest.fn(), jobDetails, allCards: [{ ...jobDetails }], setAllCards: jest.fn(), setFilteredCards: jest.fn() });
beforeEach(() => {
  validation.validateCreateJobForm.mockReturnValue({});
  jobPostingApi.update.mockResolvedValue({});
});
it("pre fills inputs with job details", () => {
  render(<EditJobs {...makeProps()} />);
  expect(screen.getByDisplayValue("Frontend Dev")).toBeInTheDocument();
  expect(screen.getByDisplayValue("Remote")).toBeInTheDocument();
});
it("block submit and show error, validation fails", async () => {
  validation.validateCreateJobForm.mockReturnValue({ title: "Title required" });
  render(<EditJobs {...makeProps()} />);
  await act(async () => fireEvent.click(screen.getByRole("button", { name: /save/i })));
  expect(screen.getByText("Title required")).toBeInTheDocument();
  expect(jobPostingApi.update).not.toHaveBeenCalled();
});
it("calls update api on submit", async () => {
  render(<EditJobs {...makeProps()} />);
  await act(async () => fireEvent.click(screen.getByRole("button", { name: /save/i })));
  await waitFor(() => expect(jobPostingApi.update).toHaveBeenCalledWith("j1", expect.objectContaining({ title: "Frontend Dev" })));
});