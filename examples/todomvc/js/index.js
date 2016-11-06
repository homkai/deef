import app from './app';
import todoModel from './todo/model';
import Todo from './todo/Main';

app.model(todoModel);
app.start('.todoapp', Todo);
