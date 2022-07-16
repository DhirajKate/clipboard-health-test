# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

**Unknown details**

    - If database schema for agent table is modified to accomodate the custom id field
    - Is there any existing api to update agent details which needs to be modified to accomodate the custom id field
    - Is there any create agent api which adds agent to database which needs to be modified to accomodate custom id field
    - Major unknown is how user tobe pushed to include custom ids to existing agents when database schema is updated, because in report we need to make sure either all records with custom ids to be shown or fallback to show database id if custom id for record is not present
    - How shifts schema is implemented- guessing it is start_time and end_time and not a total hours*
    - How report is retured to the client- guessing here as a PDF


### Ticket 1

**Modify the database schema for agent table to add custom_id column and update default value to be null for existing records.** 

**Acceptance Criteria**

    > Every record in agent table should have custom_id column with default null value.

**Efforts Estimation - S**



### Ticket 2

**Modify existing apis to add custom id to agent.**

**Acceptance Criteria**

    > When agent is created/modified in database should create a record with custom_id field with provided custom_id field or default null value if custom_id is missing.

**Efforts Estimation - M (Code changes efforts are minimum but impact is on existing functionality so testing efforts and impact analysis add some complexity to given ticket)**

**Tasks**

    -   Modify the existing create agent api to save custom id for given agent.(Modify the insert queries)
    -   Modify the existing update agent api to save custom id for given agent.(Modify the update query)
    -   Create a new api updateAgentWithCustomId which will only update the agent with custom_id only if given agent exists in database.

 
### Ticket 3

**Create a new api updateAgentWithCustomId which will only update the agent with custom_id only if given agent exists in database.**

**Acceptance Criteria**

    > When given api is called, agent must be updated with given custom_id. If custom_id is missing should do nothing and return invalid input error.

**Efforts Estimation -S(Code changes efforts are minimum but impact is less)**

**Tasks
    
    -   Create a new api updateAgentWithCustomId which will only update the agent with custom_id only if given agent exists in database.

### Ticket 4

**Implement the generate reports api to get reports for our client Facilities containing info on how many hours each Agent worked in a given quarter**

**Acceptance Criteria**

    > When given api is called with facility id, should return the pdf containing all the agents working for given facility having fields custom_id , name and total hours they worked in the quarter.

**Efforts Estimation -L(Complexity is large considering the code changes to calculate the some of hours for each agent)**

**Tasks
    
    -   Check if we can build up query to calculate the sum of hours for each agent in given facility in every shift they work upon group by agent id/custom_id(if all agents are having custom_id cumpolsary)
    -   If query is possible

        >  Build a generateReportWithAgentTotalHours method to get report from the quering data and build a pdf to return to user.

    -   If direct querying is not possible or optimized way to implement

        >  implement method calculateTotalHoursPerAgent to calculate total hours for each agent which use shifts data get from getShiftsByFacility method

        >  implement a generateReportWithAgentTotalHours method to generate and return pdf which use input data from calculateTotalHoursPerAgent method.
