import { Login, Home, NotFound, Help, Feedback } from "./../containers";
//
import {
  AppModal,
  BackstageModal,
  MailModal,
  MessageModal,
  UserModal,
  WorkModal
} from "./../containers/Home/index.js";
export const routes = [
         {
           path: "/login",
           component: Login
         },
         {
           path: "/help",
           component: Help
         },
         {
           path: "/feedback",
           component: Feedback
         },
         {
           path: "/",
           component: Home,
           routes: [
             {
               path: "/",
               component: MessageModal,
               exact:true,
               routes: []
             },
             {
               path: "/message",
               component: MessageModal,
               routes: []
             },
             {
               path: "/work",
               component: WorkModal,
               routes: []
             },
             {
               path: "/mail",
               component: MailModal,
               routes: []
             },
             {
               path: "/app",
               component: AppModal,
               routes: []
             },
             {
               path: "/backstage",
               component: BackstageModal,
               routes: []
             },
             {
               path: "/user",
               component: UserModal,
               routes: []
             },
            //  {
            //    path: "*",
            //    component: NotFound
            //  }
           ]
         },
         {
           path: "*",
           component: NotFound
         }
       ];

export const contentRoutes = routes[1].routes;
